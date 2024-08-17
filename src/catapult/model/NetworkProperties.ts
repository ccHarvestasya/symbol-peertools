/* eslint-disable max-params */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
export class NetworkProperties {
  constructor(
    public readonly network: {
      identifier?: string
      nemesisSignerPublicKey?: string
      nodeEqualityStrategy?: string
      generationHashSeed?: string
      epochAdjustment?: string
    },
    public readonly chain: {
      enableVerifiableState?: boolean
      enableVerifiableReceipts?: boolean
      currencyMosaicId?: string
      harvestingMosaicId?: string
      blockGenerationTargetTime?: string
      blockTimeSmoothingFactor?: string
      importanceGrouping?: string
      importanceActivityPercentage?: string
      maxRollbackBlocks?: string
      maxDifficultyBlocks?: string
      defaultDynamicFeeMultiplier?: string
      maxTransactionLifetime?: string
      maxBlockFutureTime?: string
      initialCurrencyAtomicUnits?: string
      maxMosaicAtomicUnits?: string
      totalChainImportance?: string
      minHarvesterBalance?: string
      maxHarvesterBalance?: string
      minVoterBalance?: string
      votingSetGrouping?: string
      maxVotingKeysPerAccount?: string
      minVotingKeyLifetime?: string
      maxVotingKeyLifetime?: string
      harvestBeneficiaryPercentage?: string
      harvestNetworkPercentage?: string
      harvestNetworkFeeSinkAddressV1?: string
      harvestNetworkFeeSinkAddress?: string
      maxTransactionsPerBlock?: string
    },
    public readonly plugins: {
      accountlink?: {
        dummy?: string
      }
      aggregate?: {
        maxTransactionsPerAggregate?: string
        maxCosignaturesPerAggregate?: string
        enableStrictCosignatureCheck?: boolean
        enableBondedAggregateSupport?: boolean
        maxBondedTransactionLifetime?: string
      }
      lockhash?: {
        lockedFundsPerAggregate?: string
        maxHashLockDuration?: string
      }
      locksecret?: {
        maxSecretLockDuration?: string
        minProofSize?: string
        maxProofSize?: string
      }
      metadata?: {
        maxValueSize?: string
      }
      mosaic?: {
        maxMosaicsPerAccount?: string
        maxMosaicDuration?: string
        maxMosaicDivisibility?: string
        mosaicRentalFeeSinkAddressV1?: string
        mosaicRentalFeeSinkAddress?: string
        mosaicRentalFee?: string
      }
      multisig?: {
        maxMultisigDepth?: string
        maxCosignatoriesPerAccount?: string
        maxCosignedAccountsPerAccount?: string
      }
      namespace?: {
        maxNameSize?: string
        maxChildNamespaces?: string
        maxNamespaceDepth?: string
        minNamespaceDuration?: string
        maxNamespaceDuration?: string
        namespaceGracePeriodDuration?: string
        reservedRootNamespaceNames?: string
        namespaceRentalFeeSinkAddressV1?: string
        namespaceRentalFeeSinkAddress?: string
        rootNamespaceRentalFeePerBlock?: string
        childNamespaceRentalFee?: string
      }
      restrictionaccount?: {
        maxAccountRestrictionValues?: string
      }
      restrictionmosaic?: {
        maxMosaicRestrictionValues?: string
      }
      transfer?: {
        maxMessageSize?: string
      }
    },
    public readonly forkHeights: {
      totalVotingBalanceCalculationFix?: string
      treasuryReissuance?: string
      strictAggregateTransactionHash?: string
    },
    public readonly treasuryReissuanceTransactionSignatures: string[],
    public readonly corruptAggregateTransactionHashes: string[]
  ) {}
}
