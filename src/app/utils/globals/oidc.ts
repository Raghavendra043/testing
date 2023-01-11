import { StorageVar } from "@utils/globals/storage-var";
import { ApiRoot } from "@app/types/api.type";

export const OIDC_CONTINUE_WITH_ID = new StorageVar(
  "continueWithIdToken",
  sessionStorage
);

export const ROOT_RESOURCE = new StorageVar<ApiRoot>(
  "rootResource",
  sessionStorage
);

export const PINCODE_SET = new StorageVar<boolean>("pincodeSet", localStorage);
