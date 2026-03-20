function SkeletonPleaseWait() {
  return (
    <div className="flex items-center gap-8 text-gray-500 cursor-wait">
      <div className="loader" />
      <small className="text-gray-500">
        Fetching data please wait
        <span className="dot-anim inline-block ml-1">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </small>
    </div>
  );
}

export default SkeletonPleaseWait;
