<template>
    <el-container style="height: 100%">
        <el-header>
            <el-button type="success" icon="el-icon-circle-plus" v-on:click="addNewEpg">增加</el-button>
        </el-header>
        <el-main ref="elmain" style="flex-grow:1;padding: 5px">
            <el-table :data="epgData" stripe border style="width: 100%;" :height="maxheight" size="mini">
                <el-table-column prop="id" label="序号" width="50"/>
                <el-table-column prop="name" label="名称" width="200"/>
                <el-table-column prop="remarks" label="备注" width="200"/>
                <el-table-column prop="source" label="来源" width="100" :formatter="sourceFormatter"/>
                <el-table-column prop="status" label="状态" width="50">
                    <template slot-scope="scope">
                        <el-button type="success" circle v-if="scope.row.status === 1" v-on:click="setStatus(scope.row,0)"/>
                        <el-button type="danger"  circle v-if="scope.row.status === 0" v-on:click="setStatus(scope.row,1)"/>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="绑定频道" width="300" :show-overflow-tooltip="true" :formatter="contentFormatter"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    import axios from "axios";
    export default {
        name: "epg",
        data() {
            return {
                epgData : [],
                maxheight : -1,
            }
        },
        mounted() {
            this.maxheight = this.$refs.elmain.$el.clientHeight;
            axios.get('/epg').then(res => {
                if (res.data.success) {
                    this.epgData = res.data.epg;
                }
            })
        },
        methods : {
            contentFormatter(row) {
                // console.log(row);
                let obj = JSON.parse(row.content);
                if (!obj) return "";
                let s = "";
                for (let i = 0; i < obj.length; i++) {
                    s = s + obj[i].pname + ",";
                }
                if (s.length > 0)
                    s = s.substr(0,s.length - 1);
                return s;
            },
            sourceFormatter(row) {
                let name = row.name;
                let index = name.indexOf('-');
                if (index === -1)
                    return "未知";
                let tmp = name.substr(0,index);
                switch (tmp) {
                    case "51zmt" :
                        return "51zmt";
                    case "tvmao":
                        return "电视猫";
                    default:
                        return "未知";

                }
            },
            handleEdit(index,row) {
                let id = row.id;
                this.$router.push({ name: 'epgitem', params: { id }});
            },
            handleDelete(index,row) {
                this.$confirm('确认要删除'+row.name+"吗?", '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '删除',
                    cancelButtonText: '放弃'
                }).then(() => {
                    axios.get('/epg/delete', {
                        params: {
                            id: row.id,
                        }
                    }).then(res => {
                        if (res.data.success) {
                            this.$message.success("删除成功!");
                            this.epgData.splice(index, 1);
                        }
                    });
                });
            },
            addNewEpg() {
                let id = -1;
                this.$router.push({ name: 'epgitem', params: { id }});
            },
            setStatus(row,value) {
                this.axios.get('/epg/setepgstatus',{params:{id:row.id,status:value}}).then(res => {
                    if (res.data.success)
                        row.status = value;
                });
            },
        }
    }
</script>

<style>

</style>
