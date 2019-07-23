import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Popup from 'reactjs-popup';
import EditFlags from './Modals/EditFlags';
import {connect} from 'react-redux';
import {getFlags,updateTableData} from '../actions/flagActions';
import styleReferenceapplication from '@openmrs/style-referenceapplication'
//Font Awesome Icons- Import only if required
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
class Flag extends Component{
    cols=[{Header:'Name',accessor:'name',Cell: row => <div style={{ 'text-align':'center' }}>{row.value}</div>},{Header:'Tags', accessor:'tags'},{Header:'Priority', accessor:'priority'},{Header:'Status', accessor:'enabled'},{Header:'Actions',accessor:'deleteFlag',Cell: row => <div style={{ 'margin': "0 auto", 'padding': "10px" }}>{row.value}</div>}]
    
    state={
        testVar:'test',
        tableData:[{name:'Flag A',message:'message',priority:'priority'}
        ],
        tableDataList:[],
        isLoading: true,
        message:''
    };

    componentDidMount(){
        this.props.dispatch(getFlags());
        this.setState({
            tableDataList:this.props.tableDataList
        })
    }
    componentDidUpdate(prevProps){
        if(prevProps.tableDataList!== this.props.tableDataList){
            var index=0;
            for (var property in this.props.tableDataList){
                this.props.tableDataList[property]['deleteFlag']=this.buttonGenerator(++index,this.props.tableDataList[property]);
                this.props.tableDataList[property]['tags'] = this.tagListGenerator(this.props.tableDataList[property].tags);
            }
            this.setState({
                tableDataList:this.props.tableDataList
            })
        }
    }
    
    getData(){
        return this.state.tableDataList;
    }
    deleteFlag(rowIndex){
        console.log(rowIndex);
        let tableData=this.state.tableDataList;
        console.log(tableData[rowIndex].name);
        //Delete Flag Service 
        this.props.dispatch(deleteTag(tableData[rowIndex].name));
        //End of Service 
        tableData.splice(rowIndex,1);
        this.setState({
            tableDataList: [...this.state.tableDataList, tableData]
          })
    }
    buttonGenerator(index,passedData){
        return (
        <div>
            <Popup trigger={<button className="iconButton edit-action"><i class="icon-pencil"></i></button>} modal closeOnDocumentClick><a className="close">x</a><EditFlags dataFromChild={passedData} callBackFromParent={this.editCallback.bind(this)} index={index}/></Popup>
            <button onClick={()=>this.deleteTag(index)} className="iconButton delete-action"><i class="icon-remove "></i></button>
        </div>
        );
    }
    tagListGenerator(passedData){
        var tagList=[];
        for(var property in passedData){
            console.log('Tag Property',passedData[property]);
             tagList.push(passedData[property].display)
        }
        return tagList.toString()
    }

    
    updateState(){
        console.log(this.state.tableDataList);
        this.props.dispatch(updateTableData(this.state.tableDataList));
        console.log(this.props.tableDataList);
        this.setState({
            tableDataList:this.props.tableDataList
        })
    }
    
    editCallback= (dataFromChild,index) => {
        if(index!=null){
            this.setState({
                tableDataList: this.state.tableDataList.map(el => (el.name === dataFromChild.name ? Object.assign({}, el,  dataFromChild ) : el))
              },()=> this.updateState());
        }
        else {
            dataFromChild["deleteFlag"]=this.buttonGenerator(this.state.tableDataList.length,dataFromChild);
            dataFromChild['tags']=this.tagListGenerator(dataFromChild['tags']);
            this.setState({
                tableDataList: [...this.state.tableDataList, dataFromChild]
              }, ()=> this.updateState());    
        }
    }
        render(){
            return (
            <div>
                <h2>Manage Flags</h2>
                <Popup trigger={<button className="button confirm"> Add a Flag </button>} modal closeOnDocumentClick>
                    <a className="close">x</a>
                    <EditFlags callBackFromParent={this.editCallback.bind(this)} index={null}/>
                </Popup>
                <ReactTable  className="displayTable" style={{'margin-top':'5px'}} columns={this.cols} data={this.state.tableDataList} defaultPageSize='5'/>
            </div>
            );
        }
    }
    const mapStateToProps = state => ({
        tableDataList: state.flags.tableDataList,
        loading: state.flags.loading,
        error: state.flags.error
      });
      
      export default connect(mapStateToProps)(Flag);