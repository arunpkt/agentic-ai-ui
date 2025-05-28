from flask import Flask, render_template, request, jsonify
from src.main import youtubeautomationFlow
from src.state.memory import SharedState

app = Flask(__name__)
state=SharedState()

@app.route('/')
def home():
    blog_file = 'C:\\Users\\S Sairam\\Downloads\\youtube_linkedin_automation_updated (1)\\youtube_linkedin_automation_updated\\youtube_linkedin_automation\\youtube_linkedin_automation\\blog.md'
    edited_file = 'C:\\Users\\S Sairam\\Downloads\\youtube_linkedin_automation_updated (1)\\youtube_linkedin_automation_updated\\youtube_linkedin_automation\\youtube_linkedin_automation\\edited_file.md'
    post_file = 'C:\\Users\\S Sairam\\Downloads\\youtube_linkedin_automation_updated (1)\\youtube_linkedin_automation_updated\\youtube_linkedin_automation\\youtube_linkedin_automation\\post.md'

    try:
        with open(blog_file, 'r',encoding='utf-8') as file:
            blog_content = file.read()
        with open(edited_file, 'r',encoding='utf-8') as file:
            edited_file = file.read()
        with open(post_file , 'r',encoding='utf-8') as file:
            post_file = file.read()
    except FileNotFoundError as e:
        blog_content = edited_file = post_file = 'Error reading file'
        
    return render_template('index.html', 
                           blog_content=blog_content,
                           post_content=post_file,
                           edited_text_content=edited_file)

@app.route('/process', methods = ['POST'])
def process():
    data = request.json
    # user_input = data.get('youtubeURL')
    user_input = data.get('youtubeURL')
    print('Received Input:::::::',user_input)
   
    try:
        inputs = {'url': user_input}
        main_class.generate_blog(inputs)  # Call the run function with inputs

        with open(state.get('edited_post_output'), 'r', encoding='utf-8') as file:
            post_content = file.read()
            result = post_content
        
    except Exception as e:
        result = f'Error: {str(e)}'

    return jsonify({'result':result})

@app.route('/sendEmail',methods = ['POST'])
def sendEmail():
    data = request.json
    user_email_input = data.get('email')
    print('email received:::',user_email_input)

    try:
        inputs = {'email': user_email_input}
        main_class.generate_email(inputs)  # Call the run function with inputs
        result = f'{user_input} sent'

    except Exception as e:
        result = f'Error: {str(e)}'

    return jsonify({'result':result})

@app.route('/regenerate', methods=['POST'])
def regenerate():
    try:
        data = request.json
        prompt = data.get('prompt', 'Improve the blog')  # fallback prompt
        print(f"Regenerating with prompt: {prompt}")

        result = main_class.regenerate_content({'prompt': prompt})
        with open(state.get('rewritten_post'), 'r', encoding='utf-8') as file:
            post_content = file.read()
            result = post_content
        return jsonify({'result': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/view-content')
def view_content():
    return render_template('view_content.html')


if __name__ == '__main__':
    main_class = youtubeautomationFlow()
    app.run(debug=True)