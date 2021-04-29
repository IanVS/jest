/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export declare function isJestJasmineRun(): boolean;
export declare function skipSuiteOnJasmine(): void;
export declare function skipSuiteOnJestCircus(): void;
export declare function onNodeVersions(versionRange: string, testBody: () => void): void;
