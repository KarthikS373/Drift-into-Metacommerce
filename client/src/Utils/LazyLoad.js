let buffer = {};

let lazyLoad = async (filename) => {
    if(!buffer.hasOwnProperty(filename)){
        let module = await import(`${filename}`)
        const obj = new module.default
        buffer[filename] = obj
        return obj
    } 
    return buffer[filename]
}

export default lazyLoad