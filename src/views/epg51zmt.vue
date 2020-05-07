<template>
    <el-container>
        <el-header>
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-select placeholder="请选择分类" size="small" v-model="editcate">
                                <el-option
                                        v-for="item in cates"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>

                            </el-select>
                        </el-col>
                        <el-col :span="12">
                            <el-select placeholder="请选择节目" size="small" v-model="editprog">
                                <el-option
                                        v-for="item in programes"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>

                            </el-select>
                        </el-col>

                    </el-row>
                </el-col>

                <el-col :span="1">
                    <span style="font-size: 12px">=</span>
                </el-col>

                <el-col :span="8">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-select placeholder="请选择51zmt分类" size="small" v-model="edit51cate">
                                <el-option
                                        v-for="item in cate51zmt"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12">
                            <el-select placeholder="请选择51zmt节目" size="small" v-model="edit51prog">
                                <el-option
                                        v-for="item in program51zmt"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.id">
                                </el-option>

                            </el-select>
                        </el-col>

                    </el-row>
                </el-col>

                <el-col :span="7">
                    <el-button-group>
                        <el-button size="small" type="primary" v-on:click="addBind" v-if="currentEditIndex === -1">增加
                        </el-button>
                        <el-button size="small" type="success" v-on:click="modiBind" v-if="currentEditIndex !== -1">修改
                        </el-button>
                    </el-button-group>
                    <el-button-group>
                        <el-button size="small" type="warning" v-on:click="read51zmt">读取51zmt节目单</el-button>
                        <el-button size="small" type="success" v-on:click="autoMatch">自动智能对应</el-button>
                    </el-button-group>
                </el-col>

            </el-row>
        </el-header>
        <el-main>
            <el-table size="small" :data="bindlist" stripe border style="width: 100%;">
                <el-table-column prop="pcate" label="分类" width="150"/>
                <el-table-column prop="pname" label="名称" width="200"/>
                <el-table-column prop="ecate" label="51zmt分类" width="150"/>
                <el-table-column prop="ename" label="51zmt名称" width="200"/>
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
        </el-main>
    </el-container>
</template>

<script>
    import axios from "axios";

    export default {
        name: "epg51zmt",
        data() {
            return {
                cate51zmt: [],
                program51zmt: [],
                cates: [],
                programes: [],
                edit51cate: "",
                edit51prog: "",
                edit51id: "",
                editcate: "",
                editprog: "",
                all51list: [],
                alllist: [],
                bindlist: [],
                currentEditIndex: -1,
            }
        },
        mounted() {
            this.loadAllData();
        },
        watch: {
            edit51cate: function (newValue) {
                this.program51zmt = [];
                for (let i = 0; i < this.all51list.length; i++) {
                    let item = this.all51list[i];
                    if (item.category === newValue) {
                        this.program51zmt.push({
                            id: item.tvid,
                            label: item.name,
                        });
                    }
                }
            },
            editcate: function (newValue) {
                this.programes = [];
                for (let i = 0; i < this.alllist.length; i++) {
                    let item = this.alllist[i];
                    if ((item.category === newValue) && (this.programes.indexOf(item.name) === -1)) {
                        this.programes.push(item.name);
                    }
                }

            },
        },
        methods: {
            read51zmt() {
                axios.get("/epg/get51zmtcate").then(res => {
                    if (res.data.success) {
                        this.$message.success(res.data.msg);
                    } else {
                        this.$message.error(res.data.error);
                    }
                })
            },
            loadAllData() {
                axios.get("/epg/get51zmtcatelist").then(res => {
                    if (res.data.success) {
                        this.all51list = res.data.data51;
                        this.alllist = res.data.data;

                        this.cate51zmt = [];
                        this.program51zmt = [];
                        this.cates = [];
                        this.programes = [];
                        for (let i = 0; i < this.all51list.length; i++) {
                            let item = this.all51list[i];
                            if (this.cate51zmt.indexOf(item.category) === -1)
                                this.cate51zmt.push(item.category);
                        }
                        for (let i = 0; i < this.alllist.length; i++) {
                            let item = this.alllist[i];
                            if (this.cates.indexOf(item.category) === -1)
                                this.cates.push(item.category);
                        }
                    }
                });
            },

            findNameByTvid(id) {
                for (let i = 0; i < this.all51list.length; i++) {
                    let item = this.all51list[i];
                    if (item.tvid === id) {
                        return item.name;
                    }
                }
                return "";
            },

            addBind() {
                if (this.edit51cate === "" || this.editcate === "" || this.edit51prog === "" || this.editprog === "") {
                    this.$message.error("请选择对应的频道!");
                    return;
                }
                let obj = {
                    pname: this.editprog,
                    pcate: this.editcate,
                    ecate: this.edit51cate,
                    ename: this.findNameByTvid(this.edit51prog),
                    etvid: this.edit51prog,
                };
                this.bindlist.push(obj);
            },

            modiBind() {
                if (this.currentEditIndex === -1) return;
                if (this.edit51cate === "" || this.editcate === "" || this.edit51prog === "" || this.editprog === "") {
                    this.$message.error("请选择对应的频道!");
                    return;
                }
                // let obj = {
                this.bindlist[this.currentEditIndex].pname = this.editprog;
                this.bindlist[this.currentEditIndex].pcate = this.editcate;
                this.bindlist[this.currentEditIndex].ecate = this.edit51cate;
                this.bindlist[this.currentEditIndex].ename = this.findNameByTvid(this.edit51prog);
                this.bindlist[this.currentEditIndex].etvid = this.edit51prog;
                this.currentEditIndex = -1;
            },
            handleEdit(index) {
                this.edit51cate = this.bindlist[index].ecate;
                this.edit51prog = this.bindlist[index].etvid;
                this.editcate = this.bindlist[index].pcate;
                this.editprog = this.bindlist[index].pname;
                this.currentEditIndex = index;
            },

            handleDelete(index) {
                this.bindlist.splice(index, 1);
            },

            getSourceData() {
                return JSON.stringify(this.bindlist);
            },
            setSourceData(data) {
                this.bindlist = JSON.parse(data);
                if (!this.bindlist) this.bindlist = [];
            },

            findInBindList(name) {
                for (let i = 0; i < this.bindlist.length; i++) {
                    if (this.bindlist[i].pname === name)
                        return true;
                }
                return false;
            },
            searchIn51zmt(name) {
                for (let i = 0; i < this.all51list.length; i++) {
                    let t = this.all51list[i];
                    if (t.name === name)
                        return t;
                }
                for (let i = 0; i < this.all51list.length; i++) {
                    let t = this.all51list[i];
                    if (t.name.substr(0,name.length) === name)
                        return t;
                }
                return null;
            },
            autoMatch() {
                for (let i = 0; i < this.alllist.length; i++) {
                    let p = this.alllist[i];
                    console.log(p);
                    if (this.findInBindList(p.name))
                        continue;

                    let searched = this.searchIn51zmt(p.name);
                    if (searched) {
                        let obj = {
                            pname: p.name,
                            pcate: p.category,
                            ecate: searched.category,
                            ename: searched.name,
                            etvid: searched.tvid,
                        };
                        this.bindlist.push(obj);

                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>
