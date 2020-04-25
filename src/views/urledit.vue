<template>
    <el-container style="height: 100%">
        <el-header style="height: 50px">
            <el-button v-on:click="saveAction">保存</el-button>
        </el-header>
        <el-main>
            <textarea v-model="urlList" class="textarea" v-on:keypress="onEditChanged"/>
<!--            <el-input type="textarea" v-model="urlList" :clearable="true"/>-->


        </el-main>
    </el-container>


</template>

<script>
    import axios from "axios";
    export default {
        name: "urledit",
        props: {
            id: Number,
        },
        data: function () {
            return {
                urlList : "",
                loading : false,
            }
        },
        watch : {
            id : function (newValue) {
                if (newValue === -1) return;
                axios.get('/category/urllist',{params:{id:newValue}}).then(res => {
                    if (res.data.success) {
                        this.loading = true;
                        this.urlList = res.data.urllist;
                        this.loading = false;
                    }
                });
            },
            // urllist: function (newValue,oldValue) {
            //     if (this.loading) return;
            //     if (newValue !== oldValue) {
            //             console.log("changed....");
            //             this.$emit("urledit",{changed : true});
            //     }
            // }
        },
        methods : {
            saveAction() {
                console.log(this.urlList);
                axios.get('/category/savelist',{params:{id:this.id,urllist : this.urlList}}).then( res => {
                    this.$message.info(res.data.msg);
                    if (res.data.success)
                        this.$emit("urledit",{changed : false});
                })
            },
            onEditChanged() {
                console.log("changed1....");
                this.$emit("urledit",{changed : true});
            }
        },
    }
</script>

<style scoped>
    .el-textarea {
        height: 100%;
    }
    .el-textarea#el-textarea__inner {
        height: 100%;
    }
    .textarea {
        height: 98%;
        width: 98%;
    }
</style>
