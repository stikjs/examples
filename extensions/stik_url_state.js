(function(){
  var UrlState = {};

  UrlState.$baseUrl = function(){
    return location.href;
  };

  UrlState.$pathName = function(){
    return location.pathname;
  };

  UrlState.$hash = function(newHashValue){
    return this.$locationHash(newHashValue).replace(/^#/, "");
  };

  UrlState.$locationHash = function(newHashValue){
    if (newHashValue) {
      location.hash = newHashValue;
    }

    return location.hash;
  };

  UrlState.$mainPath = function() {
    return "/" + this.$pathName().split("/")[1];
  };

  UrlState.$queries = function(){
    var result, queries, query;

    queries = this.$baseUrl().split("?")[1];

    if (queries) {
      queries = queries.split("&");
      result = {};
      for (var i = 0; i < queries.length; i++) {
        query = queries[i].split("=");

        result[query[0]] = query[1];
      }
      return result;
    } else {
      return {};
    }
  };

  window.stik.boundary({
    as: "$urlState",
    from: "controller|behavior",
    to: UrlState
  });
})();
