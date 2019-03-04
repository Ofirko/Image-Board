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
            images: [],
            clicked: null,
            comments: [],
            button: true,
            current: function() {
                return {
                    clicked: clicked
                };
            }
        },
        methods: {
            uploadFile: function(e) {
                let self = this;
                e.preventDefault();
                console.log("upload file running!", this.form.description);
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                console.log("formData worked");
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("Axios worked", resp);
                        self.images.unshift(resp.data[0]);
                        console.log("images2 looks like this", self.images);
                    })
                    .catch(err => {
                        console.log("axios error", err);
                    });

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
            },
            handleFileChange: function(e) {
                console.log("file chosen", e);
                this.form.file = e.target.files[0];
            },
            imgPop: function(id) {
                let self = this;
                console.log(id);
                axios
                    .get("/current-image/", {
                        params: {
                            id: id
                        }
                    })
                    .then(function(data) {
                        console.log(data);
                        console.log("Axios worked");
                        self.clicked = data.data.image[0];
                        self.comments = data.data.comments;
                        console.log("comments looks like this", self.comments);
                    })
                    .catch(err => {
                        console.log("axios error", err);
                    });
                // this.clicked = id;
            },
            removeClicked: function() {
                console.log("event bubbled up!");
                this.clicked = null;
            },
            morePics: function() {
                let self = this;
                let lastId = null;
                console.log(this.images.length);
                if (this.images[this.images.length - 1]) {
                    lastId = this.images[this.images.length - 1].id;
                }
                axios
                    .get("/get-more", {
                        params: {
                            lastId: lastId
                        }
                    })
                    .then(function(resp) {
                        console.log("Axios worked");
                        console.log(
                            "CURRENT LAST PIC",
                            resp.data[0][resp.data[0].length - 1].id
                        );
                        console.log("number:", resp.data[1]);
                        if (
                            resp.data[0][resp.data[0].length - 1].id ==
                            resp.data[1]
                        ) {
                            self.button = false;
                        }
                        for (var i = 0; i < resp.data[0].length; i++) {
                            self.images.push(resp.data[0][i]);
                        }
                        console.log("images looks like this", self.images);
                    })
                    .catch(err => {
                        console.log("axios error", err);
                    });
            }
        },
        mounted: function getImg() {
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
    Vue.component("img-screen", {
        data: function() {
            return {
                form: {
                    username: "",
                    comment: ""
                }
            };
        },
        template: "#img-screen",
        props: ["clicked", "comments"],
        methods: {
            modalClose: function(e) {
                e.stopPropagation();
                console.log("closing!", e);
                this.$emit("closer");
            },
            addComment: function(e) {
                e.preventDefault();
                let self = this;
                let date = new Date();
                console.log(date);
                console.log("add comment running!", this.clicked.id);
                self.comments.unshift({
                    username: this.form.username,
                    comment: this.form.comment,
                    created_at: date
                });
                axios
                    .post("/addComment", {
                        username: this.form.username,
                        comment: this.form.comment,
                        picId: this.clicked.id
                    })
                    .then(function(resp) {
                        console.log("Axios worked", resp);
                        // self.images.unshift(resp);
                        // console.log("images2 looks like this", self.images);
                    })
                    .catch(err => {
                        console.log("axios error", err);
                    });
            }
        }
    });
})();
