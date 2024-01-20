function ExamTimeOver() {
  return (
    <div className="d-flex justify-content-center">
      <div style={{ marginTop: "40vh" }}>
        <div className="mt-2">
          <div>
            <div className="d-flex justify-content-center">
              <div style={{ width: '100%' }}>Exam Time is Over</div>
            </div>
            <div className="container">
              <div className="row justify-content-md-center" style={{ paddingLeft: '75px' }}>
                <div id="examSubmitMessage" style={{ fontWeight: "bold", fontSize: "22px" }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamTimeOver;