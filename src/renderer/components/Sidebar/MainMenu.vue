<template>
    <nav class="main-menu">
        <router-link to="/send">
            <div class="inner">
                Send
            </div>
        </router-link>

        <router-link to="/receive">
            <div class="inner">
                Receive
            </div>
        </router-link>

        <router-link to="/transactions">
            <div class="inner">
                Transactions
            </div>
        </router-link>

        <router-link v-if="network === 'main'" to="/coinswap">
            <div class="inner">
                Coin Swap
            </div>
        </router-link>

        <router-link to="/znodes">
            <div class="inner">
                Masternodes
            </div>
        </router-link>

        <router-link to="/settings">
            <div class="inner">
                Settings
            </div>
        </router-link>

        <router-link to="/debugconsole">
            <div class="inner">
                Debug Console
            </div>
        </router-link>
    </nav>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name: 'MainMenu',

    computed: mapGetters({
        network: 'ApiStatus/network'
    })
}
</script>

<style lang="scss" scoped>
@import "src/renderer/styles/colors";
@import "src/renderer/styles/sizes";

@mixin highlight-styles() {
    color: var(--color-menu-link-text-highlighted);
    background-color: var(--color-menu-highlighted-element);
    font-weight: bold;
}

nav {
    a {
        display: block;

        color: var(--color-menu-link-text);
        text-decoration: none;

        padding: {
            left: $size-sidebar-link-horizontal-padding;
            right: $size-sidebar-link-horizontal-padding;
            top: $size-sidebar-link-vertical-padding;
            bottom: $size-sidebar-link-vertical-padding;
        }

        .inner {
            padding: $size-sidebar-link-inner-padding;

            &:hover {
                @include highlight-styles();
            }
        }
    }

    a.router-link-active {
        .inner {
            @include highlight-styles();
        }
    }
}
</style>
