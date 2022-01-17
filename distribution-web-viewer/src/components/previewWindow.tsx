
function PreviewWindow(props:any) {
    let content = props.content;
    if(content === "") {
        return <p>No file selected</p>
    } else {
        return <div className={"PreviewWindow"}>
            <p>{content}</p>
        </div>
    }


}
export default PreviewWindow