import Image from "next/image";
import styles from "./page.module.scss";

// How is rating calculated?
// have scores in an easy grid format to take a screenshot
// probably fixed max width content display up to 3 column grid, mobile just do one column (..idk how you would have the files though??)

// pull whatever we can out of this file
// arcade-highscores.json
// song name, difficulty, classic v half time v double time
// score
// accuracy
// max combo
// individual note judgement rating counts
// chart level
// cleared or not
// update count
// grade?
// no miss, full combo, perfect full combo?

// need to map to proper song name

// would be nice to visualize how ratings work?

// obv want to optimize display for top 25 since thats whats used a lot in-game

// show the rating big at the top

// do we worry about album art? means more work to update.....

export default function Home() {
  return (
    <div className={styles.page}>
      <header>
        
      </header>
      <main className={styles.main}>
        <div>
          File upload
        </div>
      </main>
    </div>
  );
}
