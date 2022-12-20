const FieldError = ({ error }: { error?: string }) => {
  return (
    <p className="text-red-500 text-xs italic ml-1 mt-1">
      {error?.toString() || null}
    </p>
  );
};

export default FieldError;
