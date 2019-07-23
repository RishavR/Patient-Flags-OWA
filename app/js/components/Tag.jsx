import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Popup from 'reactjs-popup';
import EditTags from './Modals/EditTags';
import {connect} from 'react-redux';
import {getTags,updateTableData,deleteTag,updateTag} from '../actions/tagActions';
//Font Awesome Icons- Import only if required
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
class Tag extends Component{
    cols=[{Header:'Tag Name',accessor:'display',Cell: row => <div style={{ 'text-align':'center' }}>{row.value}</div>},{Header:'Actions',accessor:'deleteTag',Cell: row => <div style={{ 'margin': "0 auto", 'padding': "10px" }}>{row.value}</div>}]
    
    state={
        testVar:'test',
        tableData:[{display:'Flag A',message:'message',priority:'priority'}
        ],
        tableDataList:[],
        isLoading: true,
        message:''
    };

    componentDidMount(){
        this.props.dispatch(getTags());
        this.setState({
            tableDataList:this.props.tableDataList
        })
    }
    componentDidUpdate(prevProps){
        if(prevProps.tableDataList!== this.props.tableDataList){
            var index=0;
            for (var property in this.props.tableDataList){
                this.props.tableDataList[property]['deleteTag']=this.buttonGenerator(++index,this.props.tableDataList[property]);
            }
            this.setState({
                tableDataList:this.props.tableDataList
            })
        }
    }
    updateState(){
        console.log(this.state.tableDataList);
        this.props.dispatch(updateTableData(this.state.tableDataList));
        console.log(this.props.tableDataList);
        this.setState({
            tableDataList:this.props.tableDataList
        })
    }
    
    getData(){
        return this.tableDataList;
    }
    deleteTag(rowIndex){
        console.log(rowIndex);
        let tableData=this.state.tableDataList;
        console.log(tableData[rowIndex].uuid);
        //Delete Tag Service 
        this.props.dispatch(deleteTag(tableData[rowIndex].uuid));
        //End of Service 
        tableData.splice(rowIndex,1);
        this.setState({
            tableDataList: [...this.state.tableDataList, tableData]
          })
          this.updateState();
    }
    buttonGenerator(index,passedData){
        return (
        <div>
            <Popup trigger={<button className="iconButton edit-action"><i class="icon-pencil"></i></button>} modal closeOnDocumentClick><a className="close">x</a><EditTags dataFromChild={passedData} callBackFromParent={this.editCallback.bind(this)} index={index}/></Popup>
            <button onClick={()=>this.deleteTag(index)} className="iconButton delete-action"><i class="icon-remove"></i></button>
        </div>
        );
    }

    editCallback= (dataFromChild,index) => {
        dataFromChild['display']=dataFromChild['name'];
        if(index!=null){
            this.setState({
                tableDataList: this.state.tableDataList.map(el => (el.display === dataFromChild.display ? Object.assign({}, el,  dataFromChild ) : el))
              },()=>this.updateState());
        }
        else {
            dataFromChild["deleteTag"]=this.buttonGenerator(this.state.tableDataList.length,dataFromChild);
            this.setState({
                tableDataList: [...this.state.tableDataList, dataFromChild]
              },()=>this.updateState());    
        }
    }
        render(){
            return (
            <div>
                <h2>Manage Tags</h2>
                <Popup trigger={<button className="button confirm"> Add a Tag </button>} modal closeOnDocumentClick>
                    <a className="close">x</a>
                    <EditTags callBackFromParent={this.editCallback.bind(this)} index={null}/>
                </Popup>
                <ReactTable className="displayTable" style={{'margin-top':'5px'}} columns={this.cols} data={this.state.tableDataList} defaultPageSize='5'/>
            </div>
            );
        }
    }
    const mapStateToProps = state => ({
        tableDataList: state.tags.tableDataList,
        loading: state.tags.loading,
        error: state.tags.error
      });
      
      export default connect(mapStateToProps)(Tag);