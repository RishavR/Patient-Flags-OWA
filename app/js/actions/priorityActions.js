var tableDataList=[]
var dataLoaded=false

export const GET_PRIORITIES_BEGIN   = 'GET_PRIORITIES_BEGIN';
export const GET_PRIORITIES_SUCCESS = 'GET_PRIORITIES_SUCCESS';
export const GET_PRIORITIES_FAILURE = 'GET_PRIORITIES_FAILURE';
export const UPDATE_PRIORITIES  = 'UPDATE_PRIORITIES';

export const getPrioritiesBegin = () => ({
  type: GET_PRIORITIES_BEGIN 
});

export const getPrioritiesSuccess = tableDataList => ({
  type: GET_PRIORITIES_SUCCESS,
  payload: { tableDataList }
});

export const getPrioritiesFailure = error => ({
  type: GET_PRIORITIES_FAILURE,
  payload: { error }
});
export const updatePrioritiesSuccess = tableDataList => ({
    type: UPDATE_PRIORITIES,
    payload: {tableDataList}
});

export function getPriorities(){
    return dispatch => {
        if(dataLoaded)
            return dispatch(getPrioritiesSuccess(tableDataList));
        dataLoaded=true;
        console.log("API CALLED");
        tableDataList=[]
        dispatch(getPrioritiesBegin());
        var url='http://localhost:8081/openmrs/ws/rest/v1/patientflags/priority/?v=full'; // TODO: pick up base URL from {Origin}
        var auth='Basic YWRtaW46QWRtaW4xMjM='; // TODO: pick up from user login credentials 
        console.log("Successful Entry");
        return fetch(url, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then((data) => {
            var resultData = data['results'];
            for (var property in resultData){
                if(resultData.hasOwnProperty(property)){        
                    tableDataList.push(resultData[property]);
                }     
            }
            console.log('Table Data After Fetch',tableDataList);
            dispatch(getPrioritiesSuccess(tableDataList));
        })
        .catch(error => dispatch(getPrioritiesFailure(error)));
        // End of Service 
    };
}

export function updateTableData(newtableDataList){
    console.log('Sent Data',newtableDataList);
    tableDataList= newtableDataList;
    return dispatch => {
        dispatch(getPrioritiesSuccess(tableDataList));
    };
}

export function updatePriorities(destString,updateData){
    return dispatch =>{
        console.log(JSON.stringify(updateData));
        var url='';
        if(destString==='')
            url = 'http://localhost:8081/openmrs/ws/rest/v1/patientflags/priority?v=full';
        else 
            url='http://localhost:8081/openmrs/ws/rest/v1/patientflags/priority/'+encodeURI(destString)+'?v=full'; // TODO: pick up base URL from {Origin}
        console.log(url);
        var auth='Basic YWRtaW46QWRtaW4xMjM='; // TODO: pick up from user login credentials 
        console.log("Successful Entry");
        fetch(url, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(updateData)
        }).then(res => res.json())
        .then((data) => {
            console.log(data);
        });
            dispatch(updatePrioritiesSuccess(tableDataList));
        }
}