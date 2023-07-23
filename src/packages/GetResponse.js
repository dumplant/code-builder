// import fetch from 'isomorphic-unfetch';
const { Configuration, OpenAIApi } = require('openai');

const getResponse = async (current_data, user_prompt) => {
  console.log(current_data, user_prompt);

  const configuration = new Configuration({
    apiKey: process.env.VUE_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          '你现在是一个页面开发助手，你负责根据我的需求生成描述页面的json代码，请记住，每次只能返回一段json代码。',
      },
      {
        role: 'user',
        content: `使用json来描述一个页面的例子如下：
\`\`\`JSON
{ "blocks": [ { "type": "input", "props": { "text": "姓名","size":"small" } }, { "type": "input", "props": { "text": "年龄","size":"small" } }, { "type": "button", "props": { "type": "primary", "text": "提交" } } ] }
\`\`\`
重点注意：除了我给出的键值，你不能自作主张使用和增加任何类型的键值。

现有页面的数据如下，请注意后续操作都基于当前的这个页面来进行${current_data}
请基于当前的页面，根据用户的要求${user_prompt}生成json代码`,
      },
    ],
  });
  console.log(completion.data.choices[0].message);
  //   const response = await fetch('https://api.openai-proxy.com/v1/completions', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
  //     },

  //     body: JSON.stringify({
  //       prompt: `你现在是一个页面开发助手，你负责根据我的需求生成描述页面的json代码，请记住，每次只能返回一段json代码
  // 使用json来描述一个页面的例子如下：
  // \`\`\`JSON
  // {"blocks":[{"type":"button"},{"type":"text"},{"type":"input"},{"type":"table"}]}
  // \`\`\`
  // 重点注意：除了我给出的键值，你不能自作主张使用和增加任何类型的键值

  // 现有页面的数据如下，后续操作都基于这个页面来进行${current_data}
  // 请根据用户的要求${user_prompt}生成json代码
  // `,
  //       temperature: 0.5,
  //       max_tokens: 2048,
  //       n: 1,
  //       stop: '\\n',
  //       model: 'text-davinci-003',
  //       frequency_penalty: 0.5,
  //       presence_penalty: 0.5,
  //       logprobs: 10,
  //     }),
  //   });

  // const data = await response.json();
  // // const data = await response;
  // if (!response.ok) {
  //   console.log(response);
  //   throw new Error(data.error || 'Error.');
  // }
  // console.log(data);

  // let res = data.choices[0].text.trim();
  // if (res[0] === `"` && res[res.length - 1] === `"`) {
  //   res = res.slice(1, -1);
  // }
  let res = completion.data.choices[0].message.content;
  return res;
};

export default getResponse;
