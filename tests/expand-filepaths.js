collectFiles('./test/templates')
    .then((config)=> {
        return expandFilepaths(config.files, {
            name: 'project-generator'
        });
    })
    .then((files)=>{
            files.map((file)=>console.log(file));
    })
    .catch(console.error);
