<template>
    <el-container style="height: 100%">
        <el-header style="height: 100px">
            <el-page-header @back="backToLast" content="EPG详情">

            </el-page-header>
            <div style="padding: 10px">
                <el-button type="primary" v-on:click="saveAction">保存</el-button>
            </div>

        </el-header>

        <el-main style="flex-grow: 1">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <span class="spanheader">来源:</span>
                        </el-col>
                        <el-col :span="16">
                            <el-select placeholder="请选择来源" v-model="source" size="small">
                                <el-option
                                        v-for="item in sourceOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <span class="spanheader">名称:</span>
                        </el-col>
                        <el-col :span="20">
                            <el-input size="small" v-model="editName"/>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <span class="spanheader">备注:</span>
                        </el-col>
                        <el-col :span="20">
                            <el-input size="small" v-model="editRemarks"/>
                        </el-col>
                    </el-row>
                </el-col>

            </el-row>
            <el-row style="padding-top: 20px">
                <epgSourceEdit :source="source" ref="epgsource"/>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import epgSourceEdit from "@/views/epgSourceEdit";
    import EpgSources from "../epgSource";
    import axios from  "axios";
    export default {
        name: "epgItem",
        components: {epgSourceEdit},
        props: {
            id: Number,
        },
        data() {
            return {
                editName : "",
                editRemarks : "",
                editId : -1,
                source : "",
                sourceOptions : EpgSources,
            }
        },
        mounted() {
            if (this.id === -1) return;
            this.axios.get('/epg/getepgitem',{params:{id : this.id}}).then( res => {
                if (res.data.success) {
                    let name = res.data.data.name;
                    let source = "";
                    let index = name.indexOf('-');
                    if (index > 0) {
                        source = name.substr(0,index);
                        name = name.substr(index+1);
                    }
                    this.editName = name;
                    this.editId = this.id;
                    this.editRemarks = res.data.data.remarks;
                    this.source = source;
                    this.$nextTick( () => {
                        this.$refs.epgsource.setSourceData(res.data.data.content);
                    });
                }
            });
        },
        methods : {
            saveAction() {
                if (this.source === "") {
                    this.$message.error("请选择EPG源!");
                    return;
                }
                if (this.editName === "") {
                    this.$message.error("请输入名称!");
                    return;
                }
                let data = this.$refs.epgsource.getSourceData();

                axios.post('/epg/saveepgitem',{params:{
                        id : this.editId,
                        name : this.editName,
                        remarks : this.editRemarks,
                        source : this.source,
                        data : data,
                    }}).then(res => {
                        if (res.data.success) {
                            this.editId = res.data.id;
                            this.$message.success(res.data.msg);
                        }
                })
            },
            backToLast() {
                this.$router.back();
            },
        }
    }
</script>

<style scoped>
    .editrow {
        display: flex;
        flex-direction: row;
    }
    .spanheader {
        font-size: 14px;
    }

</style>
