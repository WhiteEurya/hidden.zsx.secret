const surveyData = [
    {
      //0
      question: "认知消退是记忆过程中自然发生的一种现象，通常与注意力、记忆痕迹的巩固程度有关。您认为在日常生活中，自己认知消退的程度如何？",
      options: [
        { text: "经常会忘记一些事情，影响到我的生活或工作。", nextQuestion: 1},
        { text: "偶尔会忘记，但对我来说没有太大困扰。", nextQuestion: 2},
      ]
    },
    {
      //1
      question: "人的认知消退往往与某些情境密切相关。您的认知消退主要发生在哪些情境下？",
      options: [
      { text: "忙碌或分心时", nextQuestion: 3},
      { text: "无论何种情境都容易遗忘", nextQuestion: 4},
      ]
    },
    {
      //2
      question: "偶尔的遗忘通常是由外界或内在的因素引发的。您认为哪些因素最可能导致您认知消退?",
      options: [
      { text: "多件事项同时进行", nextQuestion: 3},
      { text: "无效信息干扰", nextQuestion: 5},
      ]
    },
    {
      //3
      question: "注意力是认知形成的重要基础，当人们分心之后，信息可能无法被有效编码，从而导致认知消退。当您分心之后能否重新集中注意力?",
      options: [
        { text: "是的，我可以重新集中注意力", nextQuestion: 7},
        { text: "不太行，我很难重新集中注意力", nextQuestion: 6},
      ]
    },
    {
      //4
      question: "研究表明，压力和疲劳会削弱记忆的形成与回忆能力。您认为自己的认知消退是否可能与压力或过度疲劳有关？",
      options: [
        { text: "是的，我认为压力很大。", nextQuestion: 8},
        { text: "不确定，可能是多种因素导致的。", nextQuestion: 7},
      ]
    },
    {
      //5
      question: "信息干扰是一种常见的遗忘现象，新旧信息的冲突可能使我们难以准确唤起已有的记忆。您是否认为新信息会干扰您对旧信息的记忆？",
      options: [
        { text: "是的，我经常混淆新旧信息。", nextQuestion: 9},
        { text: "不太会，我能区分开新旧信息。", nextQuestion: 10},
      ]
    },
    {
      //6
      question: "不同的环境会对人的认知产生不同的效果。您在哪种环境下认知效果会更好？",
      options: [
        { text: "安静的环境", nextQuestion: 10},
        { text: "嘈杂的环境", nextQuestion: 11},
      ]
    },
    {
      //7
      question: "记忆丢失常常是多种因素叠加的结果，例如注意力、情绪、环境和信息干扰等。您是否认为记忆丢失可能是由多种因素共同作用的结果？",
      options: [
        { text: "是的，记忆会受多种因素的影响", nextQuestion: 12},
        { text: "不，记忆只受个别因素的影响", nextQuestion: 13},
      ]
    },
    {
      //8
      question: "压力会导致记忆产生消退，但是压力的来源有时是来自于外部环境，有时则来自于自身内部。您认为导致您记忆消退的压力主要来自于哪里？",
      options: [
        { text: "自身内部", nextQuestion: 14},
        { text: "外部环境", nextQuestion: 15},
      ]
    },
    {
      //9
      question: "记忆策略（如间隔复习、联想记忆等）已被证明对减少记忆消失非常有效。您是否认为通过一些策略（如复习、联想等）可以减少记忆消失？",
      options: [
        { text: "是的，这些记忆策略会非常有用", nextQuestion: 16},
        { text: "不，这些记忆策略并不能帮助我", nextQuestion: 17},
      ]
    },
    {
      //10
      question: "记忆能力因人而异，一些人天生记忆力较强，而另一些人可能需要通过后天努力提高记忆水平，这和外界对记忆的影响无关。您认为自己的记忆能力如何？",
      options: [
        { text: "在不受外界干扰的情况下，我能较好地记忆", nextQuestion: 18},
        { text: "即使在不受外界干扰的情况下，我仍无法较好地记忆", nextQuestion: 19},
      ]
    },
    {
      //11
      question: "频繁复习可以强化记忆的存储过程，这通常用来对抗外界对记忆产生的负面作用。您是否认为频繁复习减少了您的遗忘？",
      options: [
        { text: "是的，频繁复习对我有所帮助", nextQuestion: 20},
        { text: "不，频繁复习对我没有作用", nextQuestion: 20},
      ]
    },
    {
      //12
      question: "心理学研究表明，了解认知消退的机制有助于更好地选择适合自己的记忆策略。如果有机会，您是否愿意深入了解记忆丢失的心理学原理？",
      options: [
        { text: "是的，我对这方面很感兴趣", nextQuestion: 20},
        { text: "不，我对这方面没有兴趣", nextQuestion: 20},
      ]
    },
    {
      //13
      question: "环境对记忆的影响不可忽视，但个体差异可能导致不同的效果。您认为在相同环境中你的认知留存是否强于大多数人？",
      options: [
        { text: "是的，我有强大的记忆力", nextQuestion: 20},
        { text: "不，我的记忆力并不出众", nextQuestion: 20},
      ]
    },
    {
      //14
      question: "心理学研究表明，利用记忆策略（如间隔复习、联想记忆等）能改变自身压力的影响。您是否认为使用记忆策略对于改善自身压力有所帮助？",
      options: [
        { text: "是的，通过记忆策略，我减少了自身压力", nextQuestion: 20},
        { text: "不，在使用记忆策略后我的压力没有缓解", nextQuestion: 20},
      ]
    },
    {
      //15
      question: "心理学研究表明，利用记忆策略（如间隔复习、联想记忆等）能改变外部因素的影响。您是否认为使用记忆策略对于改善外部因素有所帮助？",
      options: [
        { text: "是的，使用记忆策略后外部因素影响减小了", nextQuestion: 20},
        { text: "不，在使用记忆策略后外部因素仍然影响", nextQuestion: 20},
      ]
    },
    {
      //16
      question: "心理学研究不断提出新的记忆策略，例如间隔效应、测试效应等，尝试新策略可能帮助您找到更适合自己的方法。您是否会尝试更多减少记忆消失的策略？",
      options: [
        { text: "是的，我对这方面很感兴趣", nextQuestion: 20},
        { text: "不，我对这方面没有兴趣", nextQuestion: 20},
      ]
    },
    {
      //17
      question: "不同的记忆策略适合不同的人群。您是否认为使用其他策略（如制作思维导图）可能会减少您的记忆丢失？",
      options: [
        { text: "是的，我认为可能会有帮助", nextQuestion: 20},
        { text: "不，我的记忆丢失几乎已经无法解决", nextQuestion: 20},
      ]
    },
    {
      //18
      question: "思维导图和记忆宫殿是经典的记忆策略，通过构建可视化结构或空间记忆，帮助大脑更好地组织和提取信息。您是否认为您下意识地使用了这些记忆策略？",
      options: [
        { text: "是的，我会使用这些策略", nextQuestion: 20},
        { text: "不，我的记忆不需要使用这些策略", nextQuestion: 20},
      ]
    },
    {
      //19
      question: "记忆能力并非一成不变，通过特定的训练和策略，可以显著减少记忆消失并提高记忆效率。您是否认为自己的记忆能力还有提升空间？",
      options: [
        { text: "是的，我的记忆能力有待提升", nextQuestion: 20},
        { text: "不，这已经是我的记忆能力的极限了", nextQuestion: 20},
      ]
    },
    {
      //20
      question: "仔细回想过去，您丢失了什么记忆？",
      inputType: "text",
      options: [
        { text: "是的，我的记忆能力有待提升", nextQuestion: 20},
        { text: "不，这已经是我的记忆能力的极限了", nextQuestion: 20},
      ],
      handleAnswer: function(answer) {
        let url;
        switch (answer.toLowerCase().trim()) {
          case '遗忘':
            url = '';
            break;
          default:
            url = '';
        }
        window.location.href = url;
      }
    }
  ];
  let currentQuestionIndex = 0; // 当前问题索引
let isTransitioning = false;

// 切换到下一问题
function nextQuestion(selectedOptionIndex) {
  if (isTransitioning) return;

  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");

  isTransitioning = true;
  questionContainer.classList.add("fade-out"); // 添加淡出动画

  setTimeout(() => {
    // 更新问题索引
    const lastQuestion = surveyData[currentQuestionIndex];
    const lastOption = lastQuestion.options[selectedOptionIndex].nextQuestion;
    currentQuestionIndex = lastOption;

    // 如果问卷结束，显示感谢信息
    if (currentQuestionIndex >= surveyData.length) {
      questionText.innerText = "您已完成问卷，谢谢您的参与！";
      questionContainer.innerHTML = ""; // 清空选项
      questionContainer.classList.remove("fade-out");
      questionContainer.classList.add("fade-in");
      isTransitioning = false;
      return;
    }

    // 获取当前问题数据
    const currentQuestion = surveyData[currentQuestionIndex];
    questionText.innerText = currentQuestion.question;

    // 清空旧选项并动态生成新选项
    questionContainer.innerHTML = `
      <p class="question" id="question-text">${currentQuestion.question}</p>
    `;

    // 如果是最后一题，显示输入框和提交按钮
    if (currentQuestionIndex === 20) {
      questionContainer.innerHTML += `
        <input type="text" class="input" placeholder="请输入您的答案..." id="final-answer">
        <button class="submit-btn" onclick="submitFinalAnswer()">提交</button>
      `;
    } else {
      // 动态生成选项按钮
      currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "option";
        button.innerText = option.text;
        button.onclick = () => nextQuestion(index);
        questionContainer.appendChild(button);
      });
    }

    questionContainer.classList.remove("fade-out");
    questionContainer.classList.add("fade-in"); // 添加淡入动画

    setTimeout(() => {
      isTransitioning = false; // 动画结束后允许切换
    }, 500);
  }, 500); // 等待淡出动画结束
}

// 提交最终答案
function submitFinalAnswer() {
  const finalAnswer = document.getElementById("final-answer").value;

  // 调用 Vercel 的 Serverless API
  fetch("/api/submit-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer: finalAnswer }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.redirectUrl) {
        // 跳转到 API 返回的 URL
        window.location.href = data.redirectUrl;
      } else {
        alert("发生错误，请稍后重试！");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("提交失败，请稍后重试！");
    });
}