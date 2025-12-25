import PasswordSaveForm from "@/components/password/PasswordSaveForm.tsx";
import usePasswordUpdateForm from "@/hooks/usePasswordUpdateForm.tsx";


export default function PasswordUpdateForm() {
  const {form, onSubmit} = usePasswordUpdateForm();

  return (
      <PasswordSaveForm
          form={form}
          onSubmit={form.onSubmit((values) => onSubmit(values))}
          isUpdate={false}
      />
  );

  // const [popoverOpened, setPopoverOpened] = useState(false);
  // const [visible, { toggle }] = useDisclosure(false);
  // const autoFocus = useCallback(
  //     (inputElement: HTMLElement | null): void => {
  //       inputElement && inputElement.focus();
  //     },
  //     [],
  // );
  //
  // const form = useForm<passwordUpdateFormType>({
  //   initialValues: {
  //     oldPassword: "",
  //     password: "",
  //     confirmPassword: "",
  //   },
  //
  //   validate: {
  //     oldPassword: (value) => value.length !== 0
  //         ? null
  //         : "Old password cannot be empty",
  //     password: (value) =>
  //       strength == 100 ? null : "Not all requirements are satisfied",
  //     confirmPassword: (value, values) =>
  //         value === values.password ? null : "Passwords did not match",
  //   },
  // });
  //
  //
  // const checks = requirements.map((requirement, index) => (
  //   <PasswordRequirement
  //     key={index}
  //     label={requirement.label}
  //     meets={requirement.re.test(form.values.password)}
  //   />
  // ));
  // const strength = getStrength(form.values.password);
  // const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  //
  // return (
  //   <Box>
  //     <form id="form" onSubmit={form.onSubmit((values) => onSubmit(values))}>
  //       <Flex justify="center" direction="column">
  //         <Popover
  //           opened={popoverOpened}
  //           position="bottom"
  //           width="calc(100% - 68px)"
  //           shadow="md"
  //         >
  //             <PasswordInput
  //               required
  //               label="Current Password"
  //               mb="md"
  //               placeholder="Insert your current password"
  //               {...form.getInputProps("oldPassword")}
  //             />
  //           <Popover.Target>
  //             <Box
  //               w="100%"
  //               onFocusCapture={() => setPopoverOpened(true)}
  //               onBlurCapture={() => setPopoverOpened(false)}
  //             >
  //               <PasswordInput
  //                 required
  //                 label="Password"
  //                 placeholder={
  //                   "Insert your" + (isChanging ? " new " : " ") + "password"
  //                 }
  //                 visible={visible}
  //                 onVisibilityChange={toggle}
  //                 ref={autoFocus}
  //                 {...form.getInputProps("password")}
  //               />
  //             </Box>
  //           </Popover.Target>
  //           <Popover.Dropdown>
  //             <Progress color={color} value={strength} size={5} mb="xs" />
  //
  //             {checks}
  //           </Popover.Dropdown>
  //         </Popover>
  //           <PasswordInput
  //             required
  //             label="Confirm Password"
  //             placeholder={
  //               "Confirm your" + (isChanging ? " new " : " ") + "password"
  //             }
  //             mt="md"
  //             visible={visible}
  //             onVisibilityChange={toggle}
  //             {...form.getInputProps("confirmPassword")}
  //           />
  //       </Flex>
  //     </form>
  //   </Box>
  // );
}
