<template>
    <div class="cateitem">

        <el-input placeholder="请输入名称" v-model="nameValue">
            <el-button slot="append" icon="el-icon-check" v-on:click="saveClick" />
            <el-button slot="append" :icon="lockIcon" v-on:click="lockClick" />

            <el-switch slot="prepend"
                    v-model="enableValue"
                       v-on:change="onEnabledChanged"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
            </el-switch>

        </el-input>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "categoryitem",
        props: {
            id: Number,
            name: String,
            enabled: Boolean,
            password: String,
        },
        data: function () {
            return {
                enableValue: true,
                nameValue : "",
                lockIcon : "",
                checked : false,
                passwordValue : "",
            }
        },
        mounted() {
            this.enableValue = this.enabled;
            this.nameValue = this.name;
            this.passwordValue = this.password;
            this.setlockIcon();
        },
        methods: {
            setlockIcon() {
                if (this.passwordValue !== "")
                    this.lockIcon = "el-icon-lock";
                else
                    this.lockIcon = "el-icon-key";
            },
            saveClick() {
                if (this.nameValue === "") {
                    this.$message.error('分类名称不能为空');
                    return;
                }
                if (this.nameValue === this.name) {
                    return;
                }
                this.updateValue({
                    id : this.id,
                    value : this.nameValue,
                    tag : 0,
                })
            },
            updateValue(param) {
                axios.get("/category/update",{params:param}).then(res => {
                    if (res.data.success) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        })
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });

            },
            lockClick() {
                if (this.passwordValue !== "") {
                    this.passwordValue = '';
                } else
                    this.passwordValue = '123';

                this.setlockIcon();
                this.updateValue({
                    id : this.id,
                    value : this.passwordValue,
                    tag : 2,
                })
            },
            onEnabledChanged() {
                let value = 0;
                if (this.enableValue)
                    value = 1;
                this.updateValue({
                    id : this.id,
                    value : value,
                    tag : 1,
                })
            }
        }
    }
</script>

<style scoped>
    .cateitem {
        display: flex;
        flex-direction: row;
        justify-content: center;
        /*padding-top: 10px;*/
        /*height: 60px;*/
    }

</style>
