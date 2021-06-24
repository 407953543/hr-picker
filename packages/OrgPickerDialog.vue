<template>
    <el-dialog
        :visible.sync="dialogVisibleOrgPicker"
        :before-close="close"
        title="组织选择器"
        :close-on-click-modal="false"
        width="70%"
        append-to-body
    >
    <el-row class="container">
        <el-col :span="8" class="treeContainer">
            <div class="borderTitle">组织架构</div>
            <div class="orgTree scrollBox">
                <el-tree :data="orgTree"
                        ref="orgTree"
                        :props="defaultProps"
                        node-key="deptid"
                        @node-click="handleNodeClick"
                        icon-class="treeExpandIcon"
                        :expand-on-click-node="false">
                    <div class="custom-tree-node" slot-scope="{ node }">
                        <span>{{ node.label }}</span>
                    </div>
                </el-tree>
            </div>
        </el-col>
        <el-col :span="8" class="toBeSelected">
            <div class="borderTitle">请选择组织</div>
            <div class="orgTree scrollBox">
                <el-tree :data="nodeData"
                        :props="defaultProps"
                        node-key="deptid"
                        @node-click="handleNodeSelect"
                        icon-class="treeExpandIcon"
                        :expand-on-click-node="false"
                        :default-expand-all="true"
                        empty-text="">
                    <div class="custom-tree-node to-be-selected-node" slot-scope="{ node, data }">
                        <div>{{ node.label }}</div>
                        <div v-if="data.isSelected" class="selectedIcon">
                            <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <g id="1012-报表分析页面&amp;组织选择器修改" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="04-组织人才盘点规划系统-组织选择器页面说明" transform="translate(-1716.000000, -1257.000000)">
                                        <g id="编组-14备份-4" transform="translate(1120.000000, 1101.000000)">
                                            <g id="icon_勾选" transform="translate(596.000000, 156.000000)">
                                                <path d="M6,12 C2.68621701,12 0,9.31378299 0,6 C0,2.68621701 2.68621701,0 6,0 C9.31378299,0 12,2.68621701 12,6 C12,9.31378299 9.31378299,12 6,12 L6,12 Z" id="Shape" fill="#5DB85B" transform="translate(6.000000, 6.000000) scale(1, -1) translate(-6.000000, -6.000000) "></path>
                                                <polyline id="路径-4" stroke="#FFFFFF" stroke-linecap="round" points="3 6.28335094 4.78007091 8.15835094 9.06208896 4"></polyline>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                </el-tree>
            </div>
        </el-col>
        <el-col :span="8" class="haveBeenSelected">
            <div class="borderTitle">已选择组织</div>
            <div class="orgTree scrollBox">
                <div v-for="(item, index) in selectedData" @click="deleteNode(item, index)" :key='index' class="selectedNode custom-tree-node">
                    <div>{{ item.descr }}</div>
                    <div class="deleteIcon">
                        <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g id="1012-报表分析页面&amp;组织选择器修改" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="04-组织人才盘点规划系统-组织选择器页面说明" transform="translate(-2044.000000, -1833.000000)">
                                    <g id="编组-14备份-6" transform="translate(1120.000000, 1696.000000)">
                                        <g id="icon_删除" transform="translate(924.000000, 137.000000)">
                                            <path d="M0,6 C0,2.68621701 2.68621701,0 6,0 C9.31378299,0 12,2.68621701 12,6 C12,9.31378299 9.31378299,12 6,12 C2.68621701,12 0,9.31378299 0,6 Z" id="Shape" fill="#F96960" transform="translate(6.000000, 6.000000) scale(1, -1) translate(-6.000000, -6.000000) "></path>
                                            <g id="编组-17" transform="translate(6.097631, 6.333333) rotate(-45.000000) translate(-6.097631, -6.333333) translate(2.597631, 2.833333)" stroke="#FFFFFF" stroke-linecap="round">
                                                <path d="M3.45436207,6.40788204 L3.5429257,0.438222248" id="形状"></path>
                                                <path d="M0.499053384,3.39353093 L6.46871317,3.48209457" id="形状"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
    <span slot="footer">
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="close">取消</el-button>
    </span>
    </el-dialog>
</template>

<script>
    export default {
        components: {},
        name: "OrgPickerDialog",
        props: {
            dialogVisibleOrgPicker: {
                type: Boolean,
                required: true
            },
            value: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            multipleLimit: {
                type: Number
            },
            deptid: {
                type: String
            },
            setid: {
                type: String
            },
        },
        data(){
            return {
                orgTree: [],
                selectedData: [],
                nodeData: [],
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'descr'
                }
            }
        },
        mounted() {
        },
        methods:{
            // setid和deptid拼接得到唯一标志组织的主键
            getPrimaryKey(row) {
                return row.setid + row.deptid;
            },
            close() {
                this.$emit('closeDialog');
                this.nodeData = [];
                this.selectedData = [];
                // 折叠所有展开的树节点
                // for(let key in this.$refs.orgTree.$data.store.nodesMap){
                //     this.$refs.orgTree.$data.store.nodesMap[key].expanded = false;
                // }
            },
            submit() {
                if(this.multipleLimit && this.selectedData.length > this.multipleLimit) {
                    this.$message({
                        showClose: true,
                        message: '已选中组织数量超出' + this.multipleLimit + '个',
                        type: 'error'
                    });
                    return;
                }
                this.$emit('update', this.selectedData);
                this.close();
            },
            handleNodeClick(nodeData) {
                this.nodeData = [];
                let data = JSON.parse(JSON.stringify(nodeData));
                if(this.checkSelected(data.deptid) > -1) {
                    data.isSelected = true;
                } else {
                    data.isSelected = false;
                }
                //只留一层儿子节点，去除其他子孙节点
                if(data.children && data.children.length) {
                    for(let i = 0; i < data.children.length; i++) {
                        data.children[i].children = [];
                        if(this.checkSelected(data.children[i].deptid) > -1) {
                            data.children[i].isSelected = true;
                        } else {
                            data.children[i].isSelected = false;
                        }
                    }
                }
                this.nodeData.push(data);
            },
            handleNodeSelect(data) {
                let index = this.checkSelected(data.deptid);
                if(index > -1) {
                    //如果已经被选了，反选即删除
                    this.selectedData.splice(index, 1);
                    data.isSelected = false;
                }
                else {
                    if(this.selectedData.length > 0 && this.multipleLimit && this.multipleLimit === 1) {
                        this.deleteNode(this.selectedData[0], 0);
                    }
                    this.selectedData.push({
                        deptid: data.deptid,
                        descr: data.descr,
                        setid: data.setid,
                    })
                    data.isSelected = true;
                }
            },
            checkSelected(deptid) {
                for(let i = 0; i < this.selectedData.length; i++) {
                    if(this.selectedData[i].deptid === deptid) {
                        return i;
                    }
                }
                return -1;
            },
            deleteNode(item, index) {
                //第三栏删除
                this.selectedData.splice(index, 1);
                //第二栏勾选标志消除
                if(this.nodeData.length) {
                    if(this.nodeData[0].deptid === item.deptid) {
                        this.nodeData[0].isSelected = false;
                    }
                    for(let i = 0; i < this.nodeData[0].children.length; i++) {
                        if(this.nodeData[0].children[i].deptid === item.deptid) {
                            this.nodeData[0].children[i].isSelected = false;
                        }
                    }
                }
            },
            getOrgTree() {
                let params = {};
                if(this.deptid) {
                    params.deptid = this.deptid;
                    params.setid = this.setid;
                }
                if(Object.keys(params).length > 0) {
                    //异步请求
                    // orgService.getOrgTree(params).then(res => {
                    //     if(res.code === 23000) {
                            this.orgTree = [{
                                deptid: "10000211",
                                descr: "腾讯音乐",
                                setid: "TME00",
                                setid_descr: "TME集团",
                                tree_level_num: "1",
                                children: [{
                                    setid: "TME00",
                                    setid_descr: "TME集团",
                                    deptid: "10010312",
                                    descr: "这个组织层级为组",
                                    tree_level_num: "2"
                                }]
                            }]    
                    //     } else {
                    //         this.$message({
                    //             showClose: true,
                    //             dangerouslyUseHTMLString: true,
                    //             message: res.message,
                    //             type: 'error'
                    //         });
                    //     }
                    // }).catch(err => {
                    //     console.error('getOrgTree err: ', err);
                    // });
                } else {
                    this.orgTree = [{
                        deptid: "10000211",
                        descr: "腾讯音乐",
                        setid: "TME00",
                        setid_descr: "TME集团",
                        tree_level_num: "1",
                        children: [{
                            setid: "TME00",
                            setid_descr: "TME集团",
                            deptid: "10010312",
                            descr: "这个组织层级为组",
                            tree_level_num: "2"
                        }]
                    }]  
                }
            },
        },
        watch: {
            'dialogVisibleOrgPicker': function() {
                if(this.dialogVisibleOrgPicker) {
                    this.selectedData = JSON.parse(JSON.stringify(this.value));
                    this.getOrgTree();
                }
            }
        }
    }
</script>

<style scoped>
    .container {
        height: 60vh;
    }
    .treeContainer, .toBeSelected, .haveBeenSelected {
        height: 100%;
        padding: 15px 0px 15px 24px;
    }
    .toBeSelected {
        border-left: 2px solid #F0F4FA;
        border-right: 2px solid #F0F4FA;
    }
    .orgTree {
        margin: 12px 0 0 18px;
        overflow-y: auto;
        height: 90%;
    }
    .selectedNode:hover {
        background-color: #F5F7FA;
        cursor: pointer;
    }
    .selectedIcon, .deleteIcon {
        padding-left: 12px;
    }
    .deleteIcon {
        cursor: pointer;
    }
    /deep/.el-dialog{
        min-width: 800px;
    }
    /deep/ .el-dialog__body {
        padding: 0;
    }
    /deep/ .el-dialog__footer {
        border-top: 2px solid #F0F4FA;
        padding: 12px 24px;
    }

    /* 选择器内的组织树样式 */
    /deep/ .orgTree .el-tree-node__content{
        white-space: normal;
    }
    .custom-tree-node {
        padding-right: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .to-be-selected-node {
        width: 100%;
    }
    
    /deep/ .treeExpandIcon {
        margin-right: 5px;
        border: 1px solid;
        width: 3px;
        height: 3px;
        color: #1672FA;
        transition: color .25s;
    }

    /deep/ .treeExpandIcon::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 8px;
        transform:translate(-50%, -50%);
        border-top: 2px solid;
    }

    /deep/ .treeExpandIcon::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        height: 8px;
        transform: translate(-50%,-50%);
        border-left: 2px solid;
    }

    /deep/ .el-tree-node__expand-icon.expanded::before{
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 8px;
        transform:translate(-50%, -50%);
        border-top: 0px solid;
    }

    /deep/ .el-tree-node__expand-icon.is-leaf {
        color: #d0d0d0;
        cursor: not-allowed;
    }
    /deep/ .el-tree-node__expand-icon.is-leaf::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 8px;
        transform:translate(-50%, -50%);
        border-top: 2px solid;
    }
    /deep/ .el-tree-node__expand-icon.is-leaf::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        height: 8px;
        transform: translate(-50%,-50%);
        border-left: 0px solid;
    }
</style>
