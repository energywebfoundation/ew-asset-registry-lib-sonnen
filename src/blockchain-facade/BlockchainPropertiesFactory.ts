// Copyright 2018 Energy Web Foundation
// This file is part of the Origin Application brought to you by the Energy Web Foundation,
// a global non-profit organization focused on accelerating blockchain technology across the energy sector,
// incorporated in Zug, Switzerland.
//
// The Origin Application is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY and without an implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details, at <http://www.gnu.org/licenses/>.
//
// @authors: slock.it GmbH; Heiko Burkhardt, heiko.burkhardt@slock.it; Martin Kuechler, martin.kuchler@slock.it

import * as EwGeneralLib from 'ew-utils-general-lib-sonnen';
import * as Winston from 'winston';
import Web3 from 'web3';
import { createBlockchainProperties as userCreateBlockchainProperties } from 'ew-user-registry-lib';
import { AssetContractLookup, AssetConsumingRegistryLogic, SonnenProducingAssetLogic } from 'ew-asset-registry-contracts-sonnen';

export const createBlockchainProperties = async (
    logger: Winston.Logger,
    web3: Web3,
    assetContractLookupAddress: string,
): Promise<EwGeneralLib.Configuration.BlockchainProperties> => {

    const assetLookupContractInstance: AssetContractLookup = new AssetContractLookup(
        web3,
        assetContractLookupAddress);

    const userBlockchainProperties: EwGeneralLib.Configuration.BlockchainProperties =
        await userCreateBlockchainProperties(
            logger,
            web3 as any,
            await assetLookupContractInstance.userRegistry(),
        ) as any;

    return {
        consumingAssetLogicInstance: new AssetConsumingRegistryLogic(
            web3,
            await assetLookupContractInstance.assetConsumingRegistry(),
        ),
        producingAssetLogicInstance: new SonnenProducingAssetLogic(
            web3,
            await assetLookupContractInstance.assetProducingRegistry(),
        ),
        userLogicInstance: userBlockchainProperties.userLogicInstance,

        web3: web3 as any,

    };
};
