collectFiles('./test/templates')
    .then((config)=>{
        config.files.map((file) => {
            console.log(file.dest);
        });
    })
    .catch(console.error);
