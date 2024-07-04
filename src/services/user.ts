import { Lifetime } from "awilix";
import { FindConfig, UserService as MedusaUserService } from "@medusajs/medusa";
import { User } from "../models/user";
import {
  FilterableUserProps as MedusaFilterableUserProps,
  CreateUserInput as MedusaCreateUserInput,
} from "@medusajs/medusa/dist/types/user";
import type StoreRepository from "@medusajs/medusa/dist/repositories/store";
import { Selector } from "@medusajs/types";
import { checkIsAdminUser } from "../utils/checkIsAdminUser";

type CreateUserInput = {
  store_id?: string;
} & MedusaCreateUserInput;

type FilterableUserProps = { store_id?: string } & MedusaFilterableUserProps;

class UserService extends MedusaUserService {
  static LIFE_TIME = Lifetime.TRANSIENT;
  protected readonly loggedInUser_: User | null;
  protected readonly storeRepository_: typeof StoreRepository;

  constructor(container, options) {
    // @ts-ignore
    super(...arguments);

    this.storeRepository_ = container.storeRepository;

    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async create(user: CreateUserInput, password: string): Promise<User> {
    if (!user.store_id) {
      const storeRepo = this.manager_.withRepository(this.storeRepository_);
      let newStore = storeRepo.create();
      newStore = await storeRepo.save(newStore);
      user.store_id = newStore.id;
    }

    return await super.create(user, password);
  }

  /**
   * Assigns store_id to selector if not provided except for admin user who can see all users
   * @param selector
   */
  private prepareListConfig_(
    selector?: Selector<User>,
    config?: FindConfig<FilterableUserProps>
  ) {
    selector = selector || {};

    const isAdminUser = checkIsAdminUser(this.loggedInUser_);
    if (!isAdminUser && this.loggedInUser_?.store_id && !selector.store_id) {
      selector.store_id = this.loggedInUser_.store_id;
    }
    config?.select?.push("store_id");
    config?.relations?.push("store");
  }

  async list(
    selector?: Selector<User> & { q?: string },
    config?: FindConfig<FilterableUserProps>
  ): Promise<User[]> {
    this.prepareListConfig_(selector, config);

    return await super.list(selector, config);
  }

  async listAndCount(
    selector?: Selector<User> & { q?: string },
    config?: FindConfig<FilterableUserProps>
  ): Promise<[User[], number]> {
    this.prepareListConfig_(selector, config);

    return await super.listAndCount(selector, config);
  }
}

export default UserService;
