import classNames from 'classnames';
import styles from './CreateQuestions.module.scss';

const cx = classNames.bind(styles);

function CreateQuestion() {
  return <h2 className={cx('abc')}>CreateQuestion page</h2>;
}

export default CreateQuestion;
