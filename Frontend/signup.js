
        function previewProfilePhoto(event) {
            const profilePreview = document.getElementById("profile-preview");
            const profileText = document.getElementById("profile-text");
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function () {
                    profilePreview.src = reader.result;
                    profileText.style.display = "none"; // Hide text when image is uploaded
                };
                reader.readAsDataURL(file);
            }
        }