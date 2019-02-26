(function() {
    new Vue({
        el: "#main",
        data: {
            form: {
                title: "",
                username: "",
                description: "",
                file: null
            },
            // name: "Ofir Katz",
            images: []
        },
        methods: {
            uploadFile: function(e) {
                {
                    e.preventDefault();
                    console.log("upload file running!", this.form.description);

                    // if (clicked) {
                    //     return;
                    // } else {
                    //     e.target.style.color = "tomato";
                    //     console.log("myfn is running", e.target);
                    //     this.cities.push({
                    //         name: "jerusalem",
                    //         country: "israel"
                    //     });
                    //     clicked = true;
                }
            },
            handleFileChange: function(e) {
                console.log("file chosen", e);
                this.form.file = e.target.files[0];
            }
        },
        mounted: function() {
            var self = this;
            axios
                .get("/get-images")
                .then(function(resp) {
                    console.log("Axios worked");
                    self.images = resp.data;
                    console.log("images looks like this", self.images);
                })
                .catch(err => {
                    console.log("axios error", err);
                });
            //make a request to get info here (Ajax etc.)
            console.log("script is mounted");
        }
    });
})();
