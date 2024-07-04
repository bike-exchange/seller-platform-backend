import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { User } from "@medusajs/medusa";
import { useAdminDeleteUser } from "medusa-react";
import { DropdownMenu, IconButton, usePrompt } from "@medusajs/ui";
import { Notify } from "./types";

export function UserActions({
  user,
  onEdit,
  notify,
}: {
  user: User;
  onEdit: () => void;
  notify: Notify;
}) {
  const promt = usePrompt();
  const { mutate: deleteUserAction } = useAdminDeleteUser(user.id, {
    onSuccess: () => {
      notify.success("Success", "User deleted successfully");
    },
    onError: () => {
      notify.error("Error", "Error occured while deleting user");
    },
  });

  const onDelete = () => {
    const confirmed = promt({
      title: "Are you sure?",
      description: "Are you sure you want to delete this user?",
      confirmText: "Delete",
    });

    if (confirmed) {
      deleteUserAction();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className="gap-x-2" onClick={onEdit}>
          <button className="btn btn-ghost btn-small flex w-full justify-start hover:bg-ui-bg-base-hover focus-visible:bg-ui-bg-base-pressed">
            <PencilSquare className="text-ui-fg-subtle mr-xsmall" />
            Edit User
          </button>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2" onClick={onDelete}>
          <button className="btn btn-ghost btn-small flex w-full justify-start text-rose-50 hover:bg-ui-bg-base-hover focus-visible:bg-ui-bg-base-pressed">
            <Trash className="text-rose-50 mr-xsmall" />
            Remove User
          </button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
