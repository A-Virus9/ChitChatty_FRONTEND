import styles from "../styles/field.module.css";

function Field({ label, type, onFieldChange}) {

  return (
    <>
      <input
        type={type}
        className={styles.fieldBox}
        placeholder={label}
        onChange={(e) => onFieldChange(e.target.value)}
      />
    </>
  );
}

export default Field;