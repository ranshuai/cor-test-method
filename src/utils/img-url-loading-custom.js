
export async function imgUrlLoadingCustorm (url) {
   let _res =  new Promise((reslove, reject) => {
        let request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("get", url, true);
        request.setRequestHeader(
            "Authorization",
            sessionStorage.getItem("Authorization")
        );
        request.onreadystatechange = e => {
            if (
                request.readyState == XMLHttpRequest.DONE &&
                request.status == 200
            ) {
                reslove(URL.createObjectURL(
                    request.response
                ))
            }
        };
        request.send(null);
   })
    let results = await _res
    return results
}