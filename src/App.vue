<template>
    <div id="app">
        <el-container style="height: 100%">
            <!-- 头部 -->
            <el-header class="header">
                <p>IPTV Manager V1.0</p>
            </el-header>
            <el-container>

                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <el-menu :default-openeds="['1','2']" :router="true">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-setting"></i>系统设置</template>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-menu"></i>节目管理</template>
                            <el-menu-item index="2-1" route="/category">节目管理</el-menu-item>
                            <el-menu-item index="2-2" route="/epg">EPG管理</el-menu-item>
                            <el-menu-item index="2-3" route="/icon">图标管理</el-menu-item>
                            <el-menu-item index="2-4" route="/iconMultiEdit">图标批量管理</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>

        </el-container>


    </div>
</template>

<script>

    export default {
        name: 'App',
        components: {}
    }
</script>
<style scoped>
    #app {
        display: flex;
        flex-direction: column;
        height: 98vh;
    }
    .header {
        font-size: 20px;
        height: 70px;
        min-height: 70px;
        background-image: url('./assets/logo.png');
        background-position: 32px 0px, 0px 0px;
        background-repeat: no-repeat, no-repeat;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
    }
    .el-main {
        padding: 5px;
    }

</style>
