<?php

declare(strict_types=1);

namespace OCA\OtpManager\Middleware;

use OCA\OtpManager\Attribute\ValidateRequestBodyDTO;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Middleware;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\IRequest;
use ReflectionException;
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
     * @throws ReflectionException
     */
    public function beforeController(Controller $controller, string $methodName): void
    {
        $rm = new \ReflectionMethod($controller, $methodName);

        $attrs = $rm->getAttributes(ValidateRequestBodyDTO::class);

        if ($attrs === []) return;

        /** @var ValidateRequestBodyDTO $cfg */
        $cfg = $attrs[0]->newInstance();

        $dtoClass = $cfg->dtoClass;

        $dto = $this->buildDtoFromRequestParams($dtoClass);

        $violations = $this->validator->validate($dto);

        if (count($violations) > 0) {
            $errors = [];

            foreach ($violations as $v) $errors[$v->getPropertyPath()][] = $v->getMessage();

            throw new OCSBadRequestException(json_encode($errors));
        }

        parent::beforeController($controller, $methodName);
    }

    /**
     * @param string $dtoClass
     * @return object
     * @throws OCSBadRequestException | ReflectionException
     */
    private function buildDtoFromRequestParams(string $dtoClass): object
    {
        if (!class_exists($dtoClass)) {
            throw new OCSBadRequestException("DTO class not found: {$dtoClass}");
        }

        $rc = new \ReflectionClass($dtoClass);
        $ctor = $rc->getConstructor();
        if ($ctor === null) {
            return $rc->newInstance();
        }

        $params = $this->request->getParams();

        $missing = [];
        $args = [];

        foreach ($ctor->getParameters() as $p) {
            $name = $p->getName();

            $hasValue = array_key_exists($name, $params);

            if (!$hasValue) {
                if ($p->isDefaultValueAvailable()) {
                    $args[$name] = $p->getDefaultValue();
                    continue;
                }
                if ($p->allowsNull()) {
                    $args[$name] = null;
                    continue;
                }

                $missing[] = $name;
                continue;
            }

            if (!$p->allowsNull() && is_null($params[$name])) {
                $missing[] = $name;
                continue;
            }

            $value = $params[$name];

            $type = $p->getType();
            if ($type instanceof \ReflectionNamedType && $type->isBuiltin()) {
                $value = $this->castBuiltin($value, $type->getName(), $name);
            }

            $args[$name] = $value;
        }

        if ($missing !== []) {
            $errors = [];

            foreach ($missing as $m) $errors[] = "$m is required";

            throw new OCSBadRequestException(json_encode($errors));
        }

        return new $dtoClass(...$args);
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
            'int' => is_numeric($value) ? (int)$value : throw new OCSBadRequestException("Field {$field} must be int"),
            'float' => is_numeric($value) ? (float)$value : throw new OCSBadRequestException("Field {$field} must be float"),
            'bool' => $this->toBool($value, $field),
            'array' => is_array($value) ? $value : throw new OCSBadRequestException("Field {$field} must be array"),
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
        if (is_int($value)) return $value !== 0;
        if (is_string($value)) {
            $v = strtolower($value);
            if (in_array($v, ['1', 'true'], true)) return true;
            if (in_array($v, ['0', 'false'], true)) return false;
        }
        throw new OCSBadRequestException("Field {$field} must be bool");
    }
}
