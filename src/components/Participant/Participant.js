import classNames from 'classnames/bind';
import styles from './Participant.module.scss';

const cx = classNames.bind(styles);

function Participant({ participant }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-name')}>
                {participant.firstName} {participant.lastName}
            </div>
        </div>
    );
}

export default Participant;
