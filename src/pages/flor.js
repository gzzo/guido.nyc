import moment from "moment";
import _ from "lodash";
import { useState, useEffect } from "react";

import styles from "../styles/Flor.module.css";

function pluralize(num, word) {
  const phrase = `${num} ${word}`;
  return num === 1 ? phrase : `${phrase}s`;
}

function daysBetween(now, startDate) {
  const diff = moment.duration(now.diff(startDate));

  let phrases = [];

  if (diff.years()) {
    phrases.push({
      time: diff.years(),
      word: "year",
    });
  }

  if (diff.months()) {
    phrases.push({
      time: diff.months(),
      word: "month",
    });
  }

  phrases.push(
    {
      time: diff.days(),
      word: "day",
    },
    {
      time: diff.hours(),
      word: "hour",
    },
    {
      time: diff.minutes(),
      word: "minute",
    }
  );

  return _.join(
    _.map(phrases, (phrase) => `${pluralize(phrase.time, phrase.word)}`),
    ", "
  );
}

export default function Flor() {
  const startDate = moment(new Date(2022, 4, 21, 12, 0));
  const returnDate = moment(new Date(2023, 3, 20, 8, 0));
  const [now, setNow] = useState(moment());
  const [intervalRef, setIntervalRef] = useState(null);

  useEffect(() => {
    setIntervalRef(
      setInterval(() => {
        setNow(moment());
      }, 1000 * 60)
    );

    return () => {
      clearInterval(intervalRef);
    };
  }, []);

  return (
    <div className={styles.page}>
      <div>
        <div className={styles.header}>🌸</div>
        <div>{daysBetween(now, startDate)}</div>
        {now < returnDate && <div>{daysBetween(returnDate, now)}</div>}
      </div>
    </div>
  );
}
