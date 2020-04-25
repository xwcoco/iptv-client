<template>
    <el-container>
        <el-main>
            <el-card v-for="(item,index) in cateList " v-bind:key="index">
                <div slot="header">
                    <span>{{item.category}}</span>
                </div>
                <el-checkbox v-for="(pitem,pindex) in item.progs" v-bind:key="pindex" v-model="pitem.checked">{{pitem.name}}</el-checkbox>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import axios from "axios";
    export default {
        name: "epgdefault",
        data() {
            return {
                alllist :[],
                cateList : [],
                checkedData : [],
            }
        },
        mounted() {
            console.log("mounted....");
            this.loadAllData();
        },

        methods : {
            findCategory(id,cate) {
                for (let i = 0; i < this.cateList.length; i++) {
                    let item = this.cateList[i];
                    if (item.cateid === id) {
                        return item;
                    }
                }
                let item = {
                    cateid : id,
                    category : cate.category,
                    progs : [],
                };
                this.cateList.push(item);
                return item;
            },
            findChecked(name) {
                for (let i = 0; i < this.checkedData.length; i++) {
                    if (this.checkedData[i].pname === name) return true;
                }
                return false;
            },
            loadAllData() {
                axios.get("/epg/getalllist").then(res => {
                    if (res.data.success) {
                        this.alllist = res.data.data;
                        this.cateList = [];
                        for (let i = 0; i < this.alllist.length; i++) {
                            let item = this.alllist[i];
                            let find = this.findCategory(item.cateid,item);
                            find.progs.push({
                                id : item.id,
                                name : item.name,
                                checked : this.findChecked(item.name),
                            });
                        }
                    }
                });
            },
            getSourceData() {
                let sels = [];
                for (let i = 0; i < this.cateList.length; i++) {
                    let item = this.cateList[i];
                    for (let j = 0; j < item.progs.length; j++) {
                        let pitem = item.progs[j];
                        if (pitem.checked) {
                            sels.push({
                                pname : pitem.name,
                            })
                        }
                    }
                }
                return JSON.stringify(sels);
            },
            setSourceData(data) {
                this.checkedData = JSON.parse(data);
                if (!this.checkedData)
                    this.checkedData = [];
                // console.log(sels);
                // if (sels instanceof Array) {
                //     for (let i = 0; i < sels.length; i++) {
                //         let item = sels[i];
                //         for (let j = 0; j < this.cateList.length; j++) {
                //             let cate = this.cateList[j];
                //             for (let k = 0; k < cate.progs.length; k++) {
                //                 let prog = cate.progs[k];
                //                 if (prog.name === item.pname)
                //                     prog.checked = true;
                //             }
                //         }
                //     }
                // }
                // console.log(this.cateList);
                // this.$forceUpdate();
            }
        }
    }
</script>

<style scoped>

</style>
