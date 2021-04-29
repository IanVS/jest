/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
export declare const makeGlobalConfig: (overrides?: Partial<Config.GlobalConfig>) => Config.GlobalConfig;
export declare const makeProjectConfig: (overrides?: Partial<Config.ProjectConfig>) => Config.ProjectConfig;
