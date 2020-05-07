<template>
    <el-container style="height: 100%">
        <el-header style="height: 100px">
            <el-page-header @back="backToLast" content="ICON详情">

            </el-page-header>
            <div style="padding: 10px">
                <el-button type="primary" v-on:click="saveAction">保存</el-button>
            </div>

        </el-header>

        <el-main style="flex-grow: 1">
            <el-row :gutter="30">
                <el-col :span="24">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-select placeholder="请选择分类" size="small" v-model="editcate">
                                <el-option
                                        v-for="item in cates"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>

                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            <el-select placeholder="请选择节目" size="small" v-model="editprog">
                                <el-option
                                        v-for="item in programes"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>

                            </el-select>
                        </el-col>

                        <el-col :span="8">
                            <el-image :src="selectIconUrl" style="width: 50px; height: 30px">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </el-col>

                    </el-row>
                </el-col>

            </el-row>
            <el-row style="padding-top: 20px">
                <el-radio-group v-model="selectIcon">
                    <el-tabs type="border-card" v-model="activeTab">
                        <el-tab-pane v-for="(item,index) in allIconList" :label="item.path" :name="item.path"
                                     v-bind:key="index">
                            <el-radio-button v-for="(icons,iconindex) in allIconList[index].icons"
                                             v-bind:key="iconindex" :label="allIconList[index].key[iconindex]">
                                <el-image style="width: 100px; height: 60px" :src="allIconList[index].urls[iconindex]"/>
                            </el-radio-button>
                        </el-tab-pane>
                    </el-tabs>
                </el-radio-group>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        props: {
            id: Number,
        },
        data() {
            return {
                allIconList: [],
                alllist: [],
                activeTab: "",
                cateList: [],
                editcate: "",
                cates: [],
                programes: [],
                editprog: "",
                rootPath: "",
                selectIcon: "",
                selectIconUrl: "",
            }
        },
        mounted() {
            this.loadAllData();
        },
        watch: {
            editcate: function (newValue) {
                this.programes = [];
                for (let i = 0; i < this.alllist.length; i++) {
                    let item = this.alllist[i];
                    if ((item.category === newValue) && (this.programes.indexOf(item.name) === -1)) {
                        this.programes.push(item.name);
                    }
                }

            },
            selectIcon: function (newValue) {
                this.selectIconUrl = this.rootPath + newValue;
            },
        },
        methods: {
            backToLast() {
                this.$router.back();
            },
            saveAction() {
                if (this.editcate === "") {
                    this.$message.error("请选择分类!");
                    return;
                }
                if (this.editprog === "") {
                    this.$message.error("请选择节目!");
                    return;
                }
                if (this.selectIcon === "") {
                    this.$message.error("请选择图标!");
                    return;
                }
                this.axios.post("/icon/saveicon", {
                    id: this.id,
                    name: this.editprog,
                    icon: this.selectIcon,

                }).then(res => {
                    if (res.data.success) {
                        this.$message.success(res.data.msg);
                        this.backToLast();
                    }
                })
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

            dealWithAllCategoryListData(data) {
                this.alllist = data.data;
                this.cateList = [];
                for (let i = 0; i < this.alllist.length; i++) {
                    let item = this.alllist[i];
                    let find = this.findCategory(item.cateid, item);
                    find.progs.push({
                        id: item.id,
                        name: item.name,
                        // checked : this.findChecked(item.name),
                    });
                }
                for (let i = 0; i < this.alllist.length; i++) {
                    let item = this.alllist[i];
                    if (this.cates.indexOf(item.category) === -1)
                        this.cates.push(item.category);
                }

            },

            findCategoryByChannelName(name) {
                for (let i = 0; i < this.cateList.length; i++) {
                    let cate = this.cateList[i];
                    for (let j = 0; j < cate.progs.length ; j++) {
                        if (name === cate.progs[j].name)
                            return cate.category;
                    }
                }
                return  "";
            },

            setEditData(data) {
                let name = data.data[0].name;
                this.editcate = this.findCategoryByChannelName(name);
                if (this.editcate !== "") {
                    this.$nextTick( () => {
                        this.editprog = name;
                        this.selectIcon = data.data[0].icon;
                    });
                }
            },
            loadAllData() {
                let me = this;
                this.axios.all([
                    this.axios.get('/icon/allicon'),
                    this.axios.get("/epg/getalllist"),
                    this.axios.get("/icon/geticon",{params:{id:this.id}})
                ]).then(this.axios.spread(function (allIconResp,catelistResp,getIconResp) {
                    if (allIconResp.data.success) {
                        me.dealWithAllIconResp(allIconResp.data);
                    }
                    if (catelistResp.data.success)
                        me.dealWithAllCategoryListData(catelistResp.data)

                    if (me.id !== -1 && getIconResp.data.success) {
                        me.setEditData(getIconResp.data);
                    }
                }))
            },
        },
        name: "iconItem"
    }
</script>

<style scoped>

</style>
