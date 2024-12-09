import apiHelper from '../api/apiHelper';

const apiUpload = {
    uploadImage: (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return apiHelper.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default apiUpload;
