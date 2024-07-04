import {
  FocusModal,
  Button,
  Heading,
  Text,
  Label,
  Input,
  Select,
} from "@medusajs/ui";
import { useForm, Controller } from "react-hook-form";
import React from "react";
import { User } from "@medusajs/medusa";
import { Notify } from "./types";
import { useAdminUpdateUser } from "medusa-react";
import { getPossibleUserRoles } from "./utils";

enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
  DEVELOPER = "developer",
}

type UserDetailsFormValues = {
  first_name: string;
  last_name: string;
  role: UserRoles;
};

const UserEditModal = ({
  user,
  isOpen,
  isUserAdmin,
  onClose,
  notify,
}: {
  user: User | null;
  isOpen: boolean;
  isUserAdmin: boolean;
  onClose: () => void;
  notify: Notify;
}) => {
  const form = useForm<UserDetailsFormValues>({
    defaultValues: getDefaultValues(user),
  });

  const { mutate, isLoading } = useAdminUpdateUser(user?.id);

  React.useEffect(() => {
    if (user) {
      form.reset(getDefaultValues(user));
    }
  }, [user]);

  const onReset = () => {
    form.reset(getDefaultValues(user));
    onClose();
  };

  const onSubmit = form.handleSubmit(async (data) => {
    mutate(data, {
      onSuccess: () => {
        notify.success("Success", `User ${user.email} was updated`);
        onReset();
      },
      onError: () => {
        notify.error(
          "Error",
          `Error occured while updating user ${user.email}`
        );
      },
    });
  });

  const roles = getPossibleUserRoles(isUserAdmin);

  return (
    <FocusModal open={isOpen} onOpenChange={onClose}>
      <FocusModal.Content className="min-w-modal rounded-rounded bg-grey-0 overflow-x-hidden max-h-[40%] max-w-[60%] m-auto">
        <form onSubmit={onSubmit}>
          <FocusModal.Header>
            <Button isLoading={isLoading}>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Update user</Heading>
                <Text className="text-ui-fg-subtle">
                  Manage details of users on your marketplace
                </Text>
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="first_name" className="text-ui-fg-subtle">
                    First name
                  </Label>
                  <Input
                    id="first_name"
                    placeholder="Steve"
                    {...form.register("first_name")}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="last_name" className="text-ui-fg-subtle">
                    Last name
                  </Label>
                  <Input
                    id="last_name"
                    placeholder="Jobs"
                    {...form.register("last_name")}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="last_name" className="text-ui-fg-subtle">
                    Role
                  </Label>
                  <Controller
                    name="role"
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...other } }) => (
                      <Select {...other} onValueChange={onChange}>
                        <Select.Trigger>
                          <Select.Value placeholder="Select status" />
                        </Select.Trigger>
                        <Select.Content>
                          {roles.map((item) => (
                            <Select.Item key={item.value} value={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </FocusModal.Body>
        </form>
      </FocusModal.Content>
    </FocusModal>
  );
};

const getDefaultValues = (user: User | null): UserDetailsFormValues => {
  return {
    first_name: user?.first_name,
    last_name: user?.last_name,
    role: user?.role,
  };
};

export default UserEditModal;
