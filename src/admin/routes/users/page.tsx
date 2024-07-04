import { RouteConfig } from "@medusajs/admin";
import { UserGroup, Spinner, ExclamationCircle } from "@medusajs/icons";
import { useAdminUsers, useAdminGetSession } from "medusa-react";
import { useState, useMemo } from "react";
import { Container, Heading, Text, Table, StatusBadge } from "@medusajs/ui";
import { UserActions } from "./action-menu";
import { User } from "@medusajs/medusa";
import UserEditModal from "./user-edit-modal";
import { RouteProps } from "@medusajs/admin";
import InviteUsersModal from "./invite-users-modal";
import { shouldCurrentUserEditTargetUser } from "./utils";

// TODO: think of i18n

const UsersPage = ({ notify }: RouteProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 16;
  const { user: currentUser } = useAdminGetSession();
  // TODO: using UserRoles breaks the app
  const isCurrentUserAdmin = currentUser.role === "admin";
  const { users, count, isLoading, isError } = useAdminUsers({
    limit: 16,
    offset: currentPage * pageSize,
  });
  const [editUser, setEditUser] = useState<User | null>(null);

  const closeEditModal = () => {
    setEditUser(null);
  };

  const pageCount = count ? Math.ceil(count / pageSize) : 0;
  const canNextPage = useMemo(
    () => currentPage < pageCount - 1,
    [currentPage, pageCount]
  );
  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage]);

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <Container className="flex min-h-[320px] items-center justify-center mt-8">
        <Spinner className="text-ui-fg-subtle animate-spin" />
      </Container>
    );
  }

  if (isError || !users) {
    return (
      <Container className="flex min-h-[320px] items-center justify-center mt-8">
        <div className="flex items-center gap-x-2">
          <ExclamationCircle className="text-ui-fg-base" />
          <Text className="text-ui-fg-subtle">
            An error occurred while loading profile details. Reload the page and
            try again. If the issue persists, try again later.
          </Text>
        </div>
      </Container>
    );
  }

  return (
    <>
      <UserEditModal
        isOpen={!!editUser}
        onClose={closeEditModal}
        user={editUser}
        notify={notify}
      />
      <Container>
        <div className="flex justify-between align-top">
          <div className="flex flex-col gap-y-2">
            <Heading>Users</Heading>
            <Text className="text-ui-fg-subtle">
              {isCurrentUserAdmin
                ? "Manage users in the Seller Platform"
                : "manage users of your store"}
            </Text>
          </div>
          <InviteUsersModal notify={notify} isUserAdmin={isCurrentUserAdmin} />
        </div>

        <Table className="mt-4">
          <Table.Header>
            <Table.Row className="[&_th:last-of-type]:w-[1%]">
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>First and last name</Table.HeaderCell>
              <Table.HeaderCell>Marketplace role</Table.HeaderCell>
              {isCurrentUserAdmin && (
                <Table.HeaderCell>user store</Table.HeaderCell>
              )}
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users?.map((user) => {
              return (
                <Table.Row
                  key={user.id}
                  className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                >
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {[user.first_name, user.last_name]
                      .filter(Boolean)
                      .join(" ")}
                  </Table.Cell>
                  <Table.Cell>
                    {user.role === "admin" ? "Admin" : "Vendor"}
                  </Table.Cell>
                  {isCurrentUserAdmin && (
                    <Table.Cell>
                      {(user as any) /* TODO: fix this*/.store?.name}
                    </Table.Cell>
                  )}
                  {shouldCurrentUserEditTargetUser(
                    currentUser.role,
                    user.role
                  ) && (
                    <Table.Cell>
                      <UserActions
                        notify={notify}
                        user={user as User}
                        onEdit={() => {
                          setEditUser(user as User);
                        }}
                      />
                    </Table.Cell>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Table.Pagination
          count={count}
          pageSize={pageSize}
          pageIndex={currentPage}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      </Container>
    </>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Users",
    icon: UserGroup,
  },
};

export default UsersPage;
