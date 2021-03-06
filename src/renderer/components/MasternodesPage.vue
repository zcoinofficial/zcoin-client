<template>
    <div class="masternodes-page">
        <div class="inner">
            <div class="header">
                <input
                    class="filter-input"
                    v-model="filter"
                    placeholder="Filter by label, ip address or collateral address"
                />

                <div class="right">
                    <div class="show-all-znodes">
                        <input type="checkbox" v-model="showAllZnodes" />
                        <label>SHOW ALL MASTERNODES</label>
                    </div>

                    <div class="node-count">
                        <label>NODE COUNT:</label>
                        <div class="value">{{ Object.keys(masternodes).length }}</div>
                    </div>

                    <div class="my-node-count">
                        <label>MY NODES:</label>
                        <div class="value">{{ myNodeCount }}</div>
                    </div>
                </div>
            </div>

            <div class="animated-table-container">
                <AnimatedTable
                    :data="filteredTableData"
                    :fields="tableFields"
                    track-by="proTxHash"
                    no-data-message="You don't have any Masternodes."
                    :on-row-select="(rowData) => selectedMasternode = rowData"
                />
            </div>
        </div>

        <Popup v-if="selectedMasternode">
            <MasternodeInfo
                :masternode="selectedMasternode"
                @ok="selectedMasternode = null"
            />
        </Popup>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Popup from "renderer/components/shared/Popup";
import MasternodeInfo from "renderer/components/MasternodesPage/MasternodeInfo";
import AnimatedTable from "renderer/components/AnimatedTable/AnimatedTable";
import MasternodeCollateralAddress from "renderer/components/AnimatedTable/MasternodeCollateralAddress";
import MasternodeNextPaymentBlock from "renderer/components/AnimatedTable/MasternodeNextPaymentBlock";
import MasternodeIP from "renderer/components/AnimatedTable/MasternodeIP";

const tableFields = [
    {name: MasternodeIP, width: "160pt"},
    {name: MasternodeCollateralAddress},
    {name: MasternodeNextPaymentBlock, width: "160pt"}
];

export default {
    name: "MasternodesPage",

    components: {
        AnimatedTable,
        Popup,
        MasternodeInfo
    },

    data() {
        return {
            tableFields,
            filter: "",
            showAllZnodes: false,
            // We're intentionally not updating here because it's usually not very important and will mess up the UX
            // when it happens. The data will be refreshed when the user navigates away and then back to this page
            // anyway.
            masternodes: $store.getters['Masternode/masternodes'],
            selectedMasternode: null
        };
    },

    computed: {
        myNodeCount() {
            return Object.values(this.masternodes).filter(masternode => masternode.wallet.hasMasternode).length;
        },

        filteredTableData() {
            [this.filter, this.showAllZnodes];

            return Object.values(this.masternodes).filter(masternode => {
                if (!this.showAllZnodes && !masternode.wallet.hasMasternode) return false;
                if (!this.filter) return true;

                return !![
                    masternode.state.service,
                    masternode.proTxHash,
                    masternode.collateralHash,
                    masternode.collateralAddress,
                    masternode.state.ownerAddress,
                    masternode.state.votingAddress,
                    masternode.state.payoutAddress,
                    masternode.state.pubKeyOperator,
                    masternode.state.operatorPayoutAddress,
                    String(masternode.state.nextPaymentHeight),
                    masternode.state.status
                ].find(f => f && f.toLowerCase().includes(this.filter.toLowerCase()));
            }).sort((mnA, mnB) => {
                const a = mnA.state.nextPaymentHeight;
                const b = mnB.state.nextPaymentHeight;

                if (!a && !b) return 0;
                if (!a) return this.showAllZnodes ? 1 : -1;
                if (!b) return this.showAllZnodes ? -1 : 1;
                return a - b;
            })
        }
    }
};
</script>

<style lang="scss" scoped>
@import "src/renderer/styles/inputs";
@import "src/renderer/styles/sizes";
@import "src/renderer/styles/typography";
@import "src/renderer/styles/colors";

.masternodes-page {
    height: 100%;

    .inner {
        box-sizing: border-box;
        height: 100%;
        padding: $size-main-margin;

        display: flex;
        flex-flow: column;

        .header {
            width: 100%;
            overflow: auto;
            padding-bottom: $size-small-space;

            .filter-input {
                @include search-input();
                position: relative;
                float: left;
            }

            .right {
                position: relative;
                float: right;

                div {
                    display: inline-block;

                    &:not(:last-child) {
                        margin-right: $size-medium-space;
                    }

                    label {
                        @include label();
                    }

                    .value {
                        @include label();
                    }

                    * {
                        display: inline;
                    }
                }

                .show-all-znodes {
                    label {
                        color: var(--color-text-accent);
                    }
                }
            }
        }

        .animated-table-container {
            flex-grow: 1;

            .animated-table {
                height: 100%;
            }
        }
    }
}

</style>
