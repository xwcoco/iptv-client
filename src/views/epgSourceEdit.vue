<template>
    <div>
        <epg51zmt ref="epg51zmt" v-if="source === '51zmt'"/>
        <epgdefault ref="epgdefault" v-if="(source !== '51zmt') && (source !== '')"/>
    </div>
</template>

<script>
    import epgdefault from "@/views/epgdefault";
    import epg51zmt from "@/views/epg51zmt";

    export default {
        name: "epgSourceEdit",
        components: {epgdefault, epg51zmt},
        props: {
            source: String,
        },
        methods: {
            getSourceData() {
                if (this.source === "51zmt") {
                    return this.$refs.epg51zmt.getSourceData();
                } else
                    return this.$refs.epgdefault.getSourceData();
            },

            setSourceData(data) {
                if (this.source === "51zmt") {
                    this.$refs.epg51zmt.setSourceData(data);
                } else
                    this.$refs.epgdefault.setSourceData(data);
            }
        }

    }
</script>

<style scoped>

</style>
