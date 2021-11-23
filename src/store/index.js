import { merge, namespaced } from "overmind/config";
import { createOvermind } from "overmind";
import { createHook } from "overmind-react";

import * as user from "./user";
import * as projects from "./projects";
import * as lists from "./lists";

const config = merge(
  namespaced({
    user,
    projects,
    lists,
  })
);

export const overmind = createOvermind(config);

export const useOvermind = createHook();
