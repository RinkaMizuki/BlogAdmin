import React from "react";
import { Card, CardBody, Form, FormInput } from "shards-react";
import { Editor } from "@tinymce/tinymce-react";
import $ from "jquery";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "../../assets/quill.css";

const RichEditor = ({ setPostTitle, setPostContent, postTitle }) => {
  return (
    <Card small className="mb-3">
      <CardBody>
        <Form className="add-new-post">
          <FormInput size="lg" className="mb-3" placeholder="Your Post Title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
          {/* <ReactQuill className="add-new-post__editor mb-1" /> */}
          <Editor
            apiKey='xl972kp9v6u3mg2d8rzspy3mc2qwxkqbgtlktw9dwwrkggnk'
            init={{
              height: "1000px",
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image imageupload media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
              setup: function (editor) {
                const inp = $('<input id="tinymce-uploader" type="file" name="pic" accept="image/*" style="display:none">');
                $(editor.getElement()).parent().append(inp);
                inp.on("change", function () {
                  const input = inp.get(0);
                  const file = input.files[0];
                  const fr = new FileReader();
                  fr.onload = function () {
                    const img = new Image();
                    img.src = fr.result;
                    editor.insertContent('<img src="' + img.src + '"/>');
                    inp.val('');
                  }
                  fr.readAsDataURL(file);
                });
                editor.ui.registry.addButton('imageupload', {
                  icon: 'upload',
                  tooltip: "Upload image from device",
                  onAction: function (e) {
                    inp.trigger('click');
                  },
                });
              },
              tinycomments_mode: 'embedded',
              tinycomments_author: 'Author name',
              mergetags_list: [
                { value: 'First.Name', title: 'First Name' },
                { value: 'Email', title: 'Email' },
              ],
              ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
            }}
            initialValue=""
            onEditorChange={(newValue, editor) => {
              setPostContent(newValue)
            }}
          />
        </Form>
      </CardBody>
    </Card>
  )
};

export default RichEditor;
