<template>
    <el-container style="height: 100%">
        <el-main style="flex-grow:1;padding: 1px" ref="elmain">
            <el-row>
                <el-col :span="4">
                    <el-input
                            v-model="selectChannelName"
                            :disabled="true">
                    </el-input>
                </el-col>
                <el-col :span="2">
                    <el-button type="warning" icon="el-icon-d-arrow-right" v-on:click="checkExistIcon"></el-button>
                </el-col>
                <el-col :span="4">
                    <el-image :src="selectIconUrl" style="width: 80px; height: 50px" class="cpl-bg">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </el-col>
                <el-col :span="8">
                    <el-button type="success" icon="el-icon-edit-outline" v-on:click="saveAction">保存</el-button>
                </el-col>
            </el-row>
            <el-row style="padding-top: 2px">
                <el-col :span="8">
                    <el-radio-group v-model="selectChannelName">
                        <el-tabs type="border-card" v-model="activeCategory" tab-position="left">
                            <el-tab-pane v-for="(item,index) in cateList" :label="item.category" :name="item.category"
                                         v-bind:key="index">
                                <el-radio-button v-for="(channel,channelindex) in cateList[index].progs"
                                                 v-bind:key="channelindex"
                                                 :label="cateList[index].progs[channelindex].name">

                                </el-radio-button>
                            </el-tab-pane>
                        </el-tabs>
                    </el-radio-group>
                </el-col>
                <el-col :span="8">
                    <el-radio-group v-model="selectIcon">
                        <el-tabs type="border-card" v-model="activeTab">
                            <el-tab-pane v-for="(item,index) in allIconList" :label="item.path" :name="item.path"
                                         v-bind:key="index">
                                <el-radio-button v-for="(icons,iconindex) in allIconList[index].icons"
                                                 v-bind:key="iconindex" :label="allIconList[index].key[iconindex]">
                                    <el-image style="width: 100px; height: 60px"
                                              :src="allIconList[index].urls[iconindex]" class="cpl-bg"/>
                                </el-radio-button>
                            </el-tab-pane>
                        </el-tabs>
                    </el-radio-group>
                </el-col>
                <el-col :span="8">
                    <el-table :data="channelIconList" stripe border style="width: 100%;" :height="maxheight"
                              size="mini">
                        <el-table-column prop="name" label="名称" width="100"/>
                        <el-table-column prop="icon" label="图标" width="100">
                            <template slot-scope="iconscope">
                                <el-image style="width: 50px;height: 30px"
                                          :src="getIconPath(iconscope.$index,iconscope.row)" class="cpl-bg"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="handleEdit(scope.$index, scope.row)">编辑
                                </el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import axios from "axios";

    export default {
        name: "iconMultiEdit",
        computed: {
            selectIconUrl: function () {
                return this.rootPath + this.selectIcon;
            }
        },
        data() {
            return {
                allIconList: [],
                rootPath: "",
                activeTab: "",

                alllist: [],
                cateList: [],

                channelIconList: [],

                maxheight: -1,

                selectChannelName: "",

                activeCategory: "",

                selectIcon: "",
            }
        },
        mounted() {
            this.maxheight = this.$refs.elmain.$el.clientHeight;
            this.loadAllData();
        },
        methods: {
            checkExistIcon() {
                if (this.selectChannelName === "") return;
                for (let i = 0; i < this.channelIconList.length; i++) {
                    let item = this.channelIconList[i];
                    if (item.name === this.selectChannelName) {
                        this.activeTab = this.findIconGroup(item.icon);
                        this.selectIcon = item.icon;
                        break;
                    }
                }
            },
            saveAction() {
                if (this.selectChannelName === "") {
                    this.$message.error("请选择节目!");
                    return;
                }
                if (this.selectIcon === "") {
                    this.$message.error("请选择图标!");
                    return;
                }
                this.axios.post("/icon/save", {
                    name: this.selectChannelName,
                    icon: this.selectIcon,

                }).then(res => {
                    if (res.data.success) {
                        this.$message.success(res.data.msg);
                        this.reloadIconList();
                    }
                })
            },
            getIconPath(index, row) {
                return this.rootPath + row.icon;
            },

            handleEdit(index, row) {
                this.activeCategory = this.findCategoryByChannelName(row.name);
                if (this.activeCategory !== "") {
                    this.activeTab = this.findIconGroup(row.icon);
                    this.$nextTick(() => {
                        this.selectChannelName = row.name;
                        this.selectIcon = row.icon;
                    });
                }
            },

            findIconGroup(name) {
                for (let i = 0; i < this.allIconList.length; i++) {
                    let item = this.allIconList[i];
                    if (item.key.indexOf(name) !== -1)
                        return item.path;
                }
                return "";
            },

            handleDelete(index, row) {
                this.$confirm('确认要删除' + row.name + "吗?", '确认信息', {
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
            dealWithAllIconResp(data) {
                this.rootPath = data.path;
                this.allIconList = data.data;
                for (let i = 0; i < this.allIconList.length; i++) {
                    let iconlist = this.allIconList[i];
                    let iconkey = [];
                    let urls = [];
                    for (let j = 0; j < iconlist.icons.length; j++) {
                        let icon = iconlist.icons[j];
                        iconkey.push(iconlist.path + "/" + icon);
                        urls.push(this.rootPath + iconlist.path + "/" + icon);

                    }

                    iconlist.key = iconkey;
                    iconlist.urls = urls;
                }

                if ((this.activeTab === "" || this.activeTab === "0") && this.allIconList.length > 0) {
                    this.activeTab = this.allIconList[0].path;
                }
            },

            findCategory(id, cate) {
                for (let i = 0; i < this.cateList.length; i++) {
                    let item = this.cateList[i];
                    if (item.cateid === id) {
                        return item;
                    }
                }
                let item = {
                    cateid: id,
                    category: cate.category,
                    progs: [],
                };
                this.cateList.push(item);
                return item;
            },

            findChannel(list, name) {
                for (let i = 0; i < list.progs.length; i++) {
                    if (list.progs[i].name === name) return true;
                }
                return false;
            },

            dealWithAllCategoryListData(data) {
                this.alllist = data.data;
                this.cateList = [];
                for (let i = 0; i < this.alllist.length; i++) {
                    let item = this.alllist[i];
                    let find = this.findCategory(item.cateid, item);
                    if (!this.findChannel(find, item.name))
                        find.progs.push({
                            id: item.id,
                            name: item.name,
                            // checked : this.findChecked(item.name),
                        });
                }
                if (this.cateList.length > 0) {
                    this.activeCategory = this.cateList[0].category;
                }
                // for (let i = 0; i < this.alllist.length; i++) {
                //     let item = this.alllist[i];
                //     if (this.cates.indexOf(item.category) === -1)
                //         this.cates.push(item.category);
                // }

            },

            findCategoryByChannelName(name) {
                for (let i = 0; i < this.cateList.length; i++) {
                    let cate = this.cateList[i];
                    for (let j = 0; j < cate.progs.length; j++) {
                        if (name === cate.progs[j].name)
                            return cate.category;
                    }
                }
                return "";
            },

            setEditData(data) {
                this.channelIconList = data.data;
            },

            reloadIconList() {
                this.axios.get("/icon/list").then(res => {
                    if (res.data.success)
                        this.setEditData(res.data)
                });
            },

            loadAllData() {
                let me = this;
                this.axios.all([
                    this.axios.get('/icon/allicon'),
                    this.axios.get("/epg/getalllist"),
                    this.axios.get("/icon/list")
                ]).then(this.axios.spread(function (allIconResp, catelistResp, getIconResp) {
                    if (allIconResp.data.success) {
                        me.dealWithAllIconResp(allIconResp.data);
                    }
                    if (catelistResp.data.success)
                        me.dealWithAllCategoryListData(catelistResp.data)

                    if (getIconResp.data.success) {
                        me.setEditData(getIconResp.data);
                    }
                }))
            },
        }
    }
</script>

<style scoped>
    .cpl-bg {
        /*padding: 10px 0;*/
        background-color: #808080;
    }
</style>
