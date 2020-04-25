<template>
    <el-container style="height: 100%">
        <el-aside style="width: 430px">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>分类列表</span>
                    <el-button style="float: right; padding: 3px 3px" icon="el-icon-delete" type="text"
                               v-on:click="deleteCategory">删除
                    </el-button>
                    <el-button style="float: right; padding: 3px 0" icon="el-icon-circle-plus-outline" type="text"
                               v-on:click="addCategory">增加
                    </el-button>
                </div>
                <el-radio-group v-model="radioCurrent">
                    <div v-for="(item,index) in categoryList" :key="item.id"
                         style="display: flex;flex-direction: row;align-items: center;padding-bottom: 10px">
                        <el-radio :label="index">-</el-radio>
                        <categoryitem :name="item.name" :enabled="item.enable === 1" :password="item.psw"
                                      :id="item.id"/>
                    </div>
                </el-radio-group>

            </el-card>
        </el-aside>
        <el-main>
            <urledit :id="currentId" v-on:urledit="onCurrentChanged"/>
        </el-main>
    </el-container>
</template>

<script>
    import axios from "axios";
    import categoryitem from "@/views/categoryitem";
    import urledit from "@/views/urledit";

    export default {
        name: "category",
        data: function () {
            return {
                categoryList: [],
                current: -1,
                currentId: -1,
                edited : false,
            }
        },
        computed: {
            radioCurrent : {
                get: function () {
                    return this.current;
                },
                set : function (newValue) {
                    if (this.current !== -1) {
                        if (this.edited) {
                            this.$confirm('节目已经修改？确认要放弃修改吗?', '确认信息', {
                                distinguishCancelAndClose: true,
                                confirmButtonText: '返回修改',
                                cancelButtonText: '放弃修改'
                            }).then(() => {
                            }).catch(() => {
                                this.current = newValue;
                                this.edited = false;
                            });
                        } else
                            this.current = newValue;
                    } else
                        this.current = newValue;
                }
            },
        },
        watch: {
            current : function (newValue) {
                this.currentId = this.categoryList[newValue].id;
            }
        },
        mounted() {
            axios.get('/category').then(res => {
                console.log(res);
                if (res.data.success) {
                    this.categoryList = res.data.data;
                    this.current = 0;
                }
            });
        },

        components: {
            categoryitem, urledit,
        },
        methods: {
            addCategory() {
                axios.get('/category/new').then(res => {
                    if (res.data.success) {
                        let item = res.data.data[0];
                        this.categoryList.push(item);
                        this.current = this.categoryList.length - 1;
                    }
                });
            },
            deleteCategory() {
                if (this.current === -1 || this.current >= this.categoryList.length) {
                    this.$message.error("请先选择一个要删除的列表!");
                    return;
                }
                let id = this.categoryList[this.current].id;
                let lastCurrent = this.current;
                this.$confirm('确认要删除吗？', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '删除',
                    cancelButtonText: '放弃'
                }).then(() => {
                    axios.get('/category/delete', {
                        params: {
                            id: id,
                        }
                    }).then(res => {
                        if (res.data.success) {
                            this.$message.success("删除成功!");
                            this.categoryList.splice(lastCurrent, 1);
                        }
                    });
                });
            },
            onCurrentChanged(e) {
                // console.log(e);
                this.edited = e.changed;
            }
        }
    }
</script>

<style scoped>

</style>
