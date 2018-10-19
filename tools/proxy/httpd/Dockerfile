FROM centos:7
RUN yum -y update;
RUN yum -y install httpd; yum clean all;
RUN mkdir /etc/httpd/sites-available
RUN echo "IncludeOptional sites-available/*.conf" >> /etc/httpd/conf/httpd.conf
COPY 01-ksi-proxy.conf /etc/httpd/sites-available/01-ksi-proxy.conf
ENTRYPOINT ["/usr/sbin/httpd", "-D", "FOREGROUND"]
