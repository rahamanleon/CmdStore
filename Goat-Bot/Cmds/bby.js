const axios = require("axios");
const baseApiUrl = async () => {
  
  return ' www.noobs-api.rf.gd/dipto '
};

module.exports.config = {
  name: "bby",
  aliases: ["baby", "bbe", "babe"],
  version: "6.9.1",
  author: "dipto",
  countDown: 0,
  role: 0,
  description: "better than all sim simi",
  category: "chat",
  guide: {
    en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR\nall OR\nedit [YourMessage] - [NewMessage]",
  },
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const link = `${await baseApiUrl()}/baby`;
  const dipto = args.join(" ").toLowerCase();
  const uid = event.senderID;

  try {
    if (!args[0]) {
      const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
      return api.sendMessage(
        ran[Math.floor(Math.random() * ran.length)],
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "remove") {
      const fina = dipto.replace("remove ", "");
      const dat = (await axios.get(`${link}?remove=${fina}&senderID;=${uid}`))
        .data.message;
      return api.sendMessage(dat, event.threadID, event.messageID);
    }

    if (args[0] === "rm" && dipto.includes("-")) {
      const [fi, f] = dipto.replace("rm ", "").split(" - ");
      const da = (await axios.get(`${link}?remove=${fi}&index;=${f}`)).data
        .message;
      return api.sendMessage(da, event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      if (args[1] === "all") {
        const data = (await axios.get(`${link}?list=all`)).data;
        const teachers = await Promise.all(
          data.teacher.teacherList.map(async (item) => {
            const number = Object.keys(item)[0];
            const value = item[number];
            const name = (await usersData.get(number)).name;
            return { name, value };
          })
        );
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers
          .map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`)
          .join("\n");
        return api.sendMessage(
          `Total Teach = ${data.length}\n? | List of Teachers of baby\n${output}`,
          event.threadID,
          event.messageID
        );
      } else {
        const d = (await axios.get(`${link}?list=all`)).data.length;
        return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
      }
    }

    if (args[0] === "msg") {
      const fuk = dipto.replace("msg ", "");
      const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
      return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
    }

    if (args[0] === "edit") {
      const [commandText, newCommand] = dipto.split(" - ");
      if (!newCommand)
        return api.sendMessage(
          "âŒ | Invalid format! Use edit [YourMessage] - [NewReply]",
          event.threadID,
          event.messageID
        );
      const dA = (
        await axios.get(
          `${link}?edit=${commandText.replace(
            "edit ",
            ""
          )}&replace;=${newCommand}&senderID;=${uid}`
        )
      ).data.message;
      return api.sendMessage(
        `âœ… Reply changed successfully! ${dA}`,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "teach" && !["amar", "react"].includes(args[1])) {
      const [comd, command] = dipto.split(" - ");
      if (!command)
        return api.sendMessage(
          "âŒ | Invalid format!",
          event.threadID,
          event.messageID
        );
      const final = comd.replace("teach ", "");
      const re = await axios.get(
        `${link}?teach=${final}&reply;=${command}&senderID;=${uid}`
      );
      const tex = re.data.message;
      const teacher = (await usersData.get(re.data.teacher)).name;
      return api.sendMessage(
        `âœ… Replies added: ${tex}\nTeacher: ${teacher}\nTeaches: ${re.data.teaches}`,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "teach" && args[1] === "react") {
      const [comd, command] = dipto.split(" - ");
      if (!command)
        return api.sendMessage(
          "âŒ | Invalid format!",
          event.threadID,
          event.messageID
        );
      const final = comd.replace("teach react ", "");
      const tex = (await axios.get(`${link}?teach=${final}&react;=${command}`))
        .data.message;
      return api.sendMessage(`âœ… Reactions added: ${tex}`, event.threadID, event.messageID);
    }

    if (dipto.includes("amar name ki") || dipto.includes("whats my name")) {
      const data = (
        await axios.get(
          `${link}?text=amar name ki&senderID;=${uid}&key=intro`
        )
      ).data.reply;
      return api.sendMessage(data, event.threadID, event.messageID);
    }

    const d = (
      await axios.get(`${link}?text=${dipto}&senderID;=${uid}&font=1`)
    ).data.reply;
    api.sendMessage(
      d,
      event.threadID,
      (error, info) => {
        if (!info || !info.messageID) return; // Validate messageID
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          d,
          apiUrl: link,
        });
      },
      event.messageID
    );
  } catch (e) {
    console.error(e);
    api.sendMessage(
      "An error occurred! Check console for details.",
      event.threadID,
      event.messageID
    );
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  try {
    if (event.body) {
      const response = (
        await axios.get(
          `${await baseApiUrl()}/baby?text=${encodeURIComponent(
            event.body.toLowerCase()
          )}&senderID;=${event.senderID}&font=1`
        )
      ).data.reply;

      api.sendMessage(response, event.threadID, (error, info) => {
        if (!info || !info.messageID) return; // Validate messageID
        global.GoatBot.onReply.set(info.messageID, {
          commandName: Reply.commandName,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
        });
      });
    }
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};
