<template>
    <el-container style="height: 100%">
        <el-header>
            <el-button type="success" icon="el-icon-circle-plus" v-on:click="addNewIcon">增加</el-button>
        </el-header>
        <el-main style="flex-grow:1;padding: 5px" ref="elmain">
            <el-table :data="channelIconList" stripe border style="width: 100%;" :height="maxheight" size="mini">
                <el-table-column prop="id" label="序号" width="50"/>
                <el-table-column prop="name" label="名称" width="200"/>
                <el-table-column prop="icon" label="图标" width="200" >
                    <template slot-scope="iconscope">
                        <el-image style="width: 100px;height: 60px" :src="getIconPath(iconscope.$index,iconscope.row)" />
                    </template>
                </el-table-column>
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
        name: "icon",
        data() {
            return {
                channelIconList : [],
                maxheight : -1,
                rootPath : "",
            }
        },
        mounted() {
            this.maxheight = this.$refs.elmain.$el.clientHeight;
            this.axios.get('/icon/list').then(res => {
                if (res.data.success) {
                    this.rootPath = res.data.path;
                    this.channelIconList = res.data.data;
                }
            })
        },
        methods: {
            addNewIcon() {
                let id = -1;
                this.$router.push({ name: 'iconitem', params: { id }});
            },
            getIconPath(index,row) {
                return this.rootPath + row.icon;
            },
            handleEdit(index,row) {
                let id = row.id;
                this.$router.push({ name: 'iconitem', params: { id }});
            },
            handleDelete(index,row) {
                this.$confirm('确认要删除'+row.name+"吗?", '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '删除',
                    cancelButtonText: '放弃'
                }).then(() => {
                    axios.get('/icon/delete', {
                        params: {
                            id: row.id,
                        }
                    }).then(res => {
                        if (res.data.success) {
                            this.$message.success("删除成功!");
                            this.channelIconList.splice(index, 1);
                        }
                    });
                });
            },
        }
    }
</script>

<style scoped>

</style>
