<?php

declare(strict_types=1);

namespace OCA\OtpManager\Middleware;

use OCA\OtpManager\Attribute\ValidateArrayOfDto;
use OCA\OtpManager\Attribute\ValidateRequestBodyDTO;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Middleware;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSException;
use OCP\IRequest;
use ReflectionClass;
use ReflectionException;
use ReflectionMethod;
use ReflectionNamedType;
use ReflectionParameter;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use function count;

final class RequestBodyValidator extends Middleware
{
    private ValidatorInterface $validator;

    public function __construct(private readonly IRequest $request)
    {
        $this->validator = Validation::createValidatorBuilder()
            ->enableAttributeMapping()
            ->getValidator();
    }

    /**
     * @param Controller $controller
     * @param string $methodName
     * @return void
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    public function beforeController(Controller $controller, string $methodName): void
    {
        try {
            $rm = new ReflectionMethod($controller, $methodName);
        } catch (ReflectionException) {
            throw new OCSException("Something went wrong");
        }

        match (strtoupper($this->request->getMethod())) {
            'GET', 'DELETE' => $this->validateMethodParams($rm),
            'POST', 'PUT', 'PATCH' => $this->validateBodyParams($rm),
            default => null,
        };
    }

    /**
     * @param ReflectionMethod $rm
     * @return void
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    private function validateBodyParams(ReflectionMethod $rm): void
    {
        $attrs = $rm->getAttributes(ValidateRequestBodyDTO::class);
        if ($attrs === []) return;

        /** @var ValidateRequestBodyDTO $cfg */
        $cfg = $attrs[0]->newInstance();

        $dto = $this->buildDto($cfg->dtoClass, $this->request->getParams(), '');

        $this->validateDto($dto, '');
    }

    /**
     * @param ReflectionMethod $rm
     * @return void
     * @throws OCSBadRequestException
     */
    private function validateMethodParams(ReflectionMethod $rm): void
    {
        $params = $this->request->getParams();
        $errors = [];

        foreach ($rm->getParameters() as $p) {
            $type = $p->getType();

            if (!$type instanceof ReflectionNamedType || !$type->isBuiltin()) continue;

            $name = $p->getName();

            [$value, $err] = $this->resolveParam($p, $params, $name);

            if ($err !== null) {
                $errors[] = $err;
                continue;
            }

            if ($value === null) continue;

            $this->castBuiltin($value, $type->getName(), $name);
        }

        if ($errors !== []) $this->throwBadRequest($errors);
    }

    /**
     * @param class-string $dtoClass
     * @param array $params
     * @param string $basePath
     * @return object
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    private function buildDto(
        string $dtoClass,
        array  $params,
        string $basePath,
    ): object
    {
        if (!class_exists($dtoClass)) $this->throwBadRequest("DTO class not found: $dtoClass");

        try {
            $rc = new ReflectionClass($dtoClass);
        } catch (ReflectionException) {
            throw new OCSException("Something went wrong");
        }
        $ctor = $rc->getConstructor();

        if ($ctor === null) {
            try {
                $obj = $rc->newInstance();
            } catch (ReflectionException) {
                throw new OCSException("Something went wrong");
            }

            if ($basePath !== '') $this->validateDto($obj, $basePath);

            return $obj;
        }

        $missing = [];
        $args = [];

        foreach ($ctor->getParameters() as $p) {
            $name = $p->getName();
            $path = $basePath === '' ? $name : "$basePath.$name";

            [$value, $err] = $this->resolveParam($p, $params, $path);

            if ($err !== null) {
                $missing[] = $err;
                continue;
            }

            if ($value === null) {
                $args[$name] = null;
                continue;
            }

            // array of DTO
            $arrayOfDtoAttrs = $p->getAttributes(ValidateArrayOfDto::class);
            if ($arrayOfDtoAttrs !== []) {
                /** @var ValidateArrayOfDto $cfg */
                $cfg = $arrayOfDtoAttrs[0]->newInstance();

                if (!is_array($value)) $this->throwBadRequest("Field $path must be array");

                $args[$name] = $this->buildArrayOfDto(
                    dtoClass: $cfg->dtoClass,
                    value: $value,
                    path: $path
                );

                continue;
            }

            $type = $p->getType();

            // nested DTO
            if ($type instanceof ReflectionNamedType && !$type->isBuiltin()) {
                $nestedClass = $type->getName();

                if (!is_array($value)) $this->throwBadRequest("Field $path must be object data (array)");

                $args[$name] = $this->buildDto(
                    dtoClass: $nestedClass,
                    params: $value,
                    basePath: $path,
                );
                continue;
            }

            // builtin (string/int/bool/array/float)
            if ($type instanceof ReflectionNamedType && $type->isBuiltin()) {
                $value = $this->castBuiltin($value, $type->getName(), $path);
            }

            $args[$name] = $value;
        }

        if ($missing !== []) $this->throwBadRequest($missing);

        $obj = new $dtoClass(...$args);

        if ($basePath !== '') $this->validateDto($obj, $basePath);

        return $obj;
    }

    /**
     * @param class-string $dtoClass
     * @param mixed $value
     * @param string $path
     * @return array
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    private function buildArrayOfDto(string $dtoClass, mixed $value, string $path): array
    {
        if (!is_array($value)) $this->throwBadRequest("Field $path must be array");

        $out = [];

        foreach ($value as $i => $item) {
            $itemPath = "{$path}[$i]";

            if (!is_array($item)) $this->throwBadRequest("Field $itemPath must be object data (array)");

            $out[] = $this->buildDto($dtoClass, $item, $itemPath);
        }

        return $out;
    }

    /**
     * @param ReflectionParameter $p
     * @param array $params
     * @param string $path
     * @return array{0: mixed, 1: string | null} [value, errorMessage]
     */
    private function resolveParam(ReflectionParameter $p, array $params, string $path): array
    {
        $name = $p->getName();

        if (!array_key_exists($name, $params)) {
            if ($p->isDefaultValueAvailable()) {
                return [$p->getDefaultValue(), null];
            }
            if ($p->allowsNull()) {
                return [null, null];
            }
            return [null, "$path is required"];
        }

        $value = $params[$name];

        if ($value === null && !$p->allowsNull()) {
            return [null, "$path cannot be null"];
        }

        return [$value, null];
    }

    /**
     * @param object $dto
     * @param string $basePath
     * @return void
     * @throws OCSBadRequestException
     */
    private function validateDto(object $dto, string $basePath): void
    {
        $violations = $this->validator->validate($dto);

        if (count($violations) === 0) return;

        $errors = [];

        foreach ($violations as $v) {
            $p = $v->getPropertyPath();
            $fullPath = ($basePath === '' || $p === '') ? ($basePath ?: $p) : "$basePath.$p";
            $errors[$fullPath][] = $v->getMessage();
        }

        $this->throwBadRequest($errors);
    }

    /**
     * @param string|array $error
     * @return never
     * @throws OCSBadRequestException
     */
    private function throwBadRequest(string|array $error): never
    {
        throw new OCSBadRequestException(is_array($error) ? json_encode($error) ?: '' : $error);
    }

    /**
     * @param mixed $value
     * @param string $type
     * @param string $field
     * @return mixed
     * @throws OCSBadRequestException
     */
    private function castBuiltin(mixed $value, string $type, string $field): mixed
    {
        if ($value === null) return null;

        return match ($type) {
            'string' => (string)$value,
            'int' => is_numeric($value) ? (int)$value : throw new OCSBadRequestException("Field $field must be int"),
            'float' => is_numeric($value) ? (float)$value : throw new OCSBadRequestException("Field $field must be float"),
            'bool' => $this->toBool($value, $field),
            'array' => is_array($value) ? $value : throw new OCSBadRequestException("Field $field must be array"),
            default => $value,
        };
    }

    /**
     * @param mixed $value
     * @param string $field
     * @return bool
     * @throws OCSBadRequestException
     */
    private function toBool(mixed $value, string $field): bool
    {
        if (is_bool($value)) return $value;
        if ($value === 0 || $value === 1) return $value === 1;
        if (is_string($value)) {
            $v = strtolower($value);
            if (in_array($v, ['1', 'true'], true)) return true;
            if (in_array($v, ['0', 'false'], true)) return false;
        }

        $this->throwBadRequest("Field $field must be bool");
    }
}
